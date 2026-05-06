import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // Fetch github_token from users table
        const { data: userData, error: dbError } = await supabase
            .from('users')
            .select('github_token')
            .eq('id', user.id)
            .single();

        if (dbError || !userData?.github_token) {
            return NextResponse.json({ error: 'GitHub not connected' }, { status: 400 });
        }

        // Fetch repositories from GitHub
        const githubResponse = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
            headers: {
                Authorization: `Bearer ${userData.github_token}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });

        if (!githubResponse.ok) {
            if (githubResponse.status === 401) {
                return NextResponse.json({ error: 'GitHub token invalid or expired' }, { status: 401 });
            }
            return NextResponse.json({ error: 'Failed to fetch repositories from GitHub' }, { status: 500 });
        }

        const repos = await githubResponse.json();
        
        const formattedRepos = repos.map((repo: any) => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            description: repo.description,
            html_url: repo.html_url,
            private: repo.private,
            updated_at: repo.updated_at,
        }));

        return NextResponse.json(formattedRepos);

    } catch (error) {
        console.error('Fetch repos error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
