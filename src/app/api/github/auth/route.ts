import { NextResponse } from 'next/server';

export async function GET() {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/github/callback`;
    
    if (!clientId) {
        return NextResponse.json({ error: 'GitHub Client ID not configured' }, { status: 500 });
    }

    // Define the scopes we need:
    // repo: to read repositories and create webhooks
    // user:email: to match user
    const scope = 'repo user:email admin:repo_hook';
    
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
    
    return NextResponse.redirect(githubAuthUrl);
}
