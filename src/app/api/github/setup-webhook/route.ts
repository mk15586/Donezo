import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
    try {
        const { repoFullName } = await request.json();
        
        if (!repoFullName) {
            return NextResponse.json({ error: 'Repository full name is required' }, { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const { data: userData } = await supabase
            .from('users')
            .select('github_token')
            .eq('id', user.id)
            .single();

        if (!userData?.github_token) {
            return NextResponse.json({ error: 'GitHub not connected' }, { status: 400 });
        }

        const webhookUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/github/webhook`;

        // Create the webhook
        const githubResponse = await fetch(`https://api.github.com/repos/${repoFullName}/hooks`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${userData.github_token}`,
                Accept: 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'web',
                active: true,
                events: ['push'],
                config: {
                    url: webhookUrl,
                    content_type: 'json',
                    insecure_ssl: process.env.NODE_ENV === 'development' ? '1' : '0'
                }
            })
        });

        if (!githubResponse.ok) {
            const errData = await githubResponse.json();
            console.error('GitHub Webhook Error:', errData);
            if (errData.errors && errData.errors[0]?.message.includes('Hook already exists')) {
                return NextResponse.json({ message: 'Webhook already exists' });
            }
            return NextResponse.json({ error: 'Failed to create webhook in GitHub', details: errData }, { status: 500 });
        }

        return NextResponse.json({ message: 'Webhook created successfully' });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
