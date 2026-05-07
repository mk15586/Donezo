import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        
        if (!query) {
            return NextResponse.json([]);
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

        const token = userData?.github_token;
        const headers: any = {
            Accept: 'application/vnd.github.v3+json',
        };
        
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        // Search GitHub users
        const githubResponse = await fetch(`https://api.github.com/search/users?q=${encodeURIComponent(query)}&per_page=10`, {
            headers
        });

        if (!githubResponse.ok) {
            return NextResponse.json({ error: 'Failed to search GitHub' }, { status: 500 });
        }

        const data = await githubResponse.json();
        
        const formattedUsers = data.items.map((item: any) => ({
            id: `github_${item.login}`,
            name: item.login,
            role: 'GitHub User',
            avatar_url: item.avatar_url
        }));

        return NextResponse.json(formattedUsers);

    } catch (error) {
        console.error('Search repos error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
