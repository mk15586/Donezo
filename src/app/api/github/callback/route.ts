import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    if (!code) {
        return NextResponse.redirect(new URL('/dashboard/version-control?error=NoCode', request.url));
    }

    try {
        const clientId = process.env.GITHUB_CLIENT_ID;
        const clientSecret = process.env.GITHUB_CLIENT_SECRET;
        const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/github/callback`;

        // Exchange code for token
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                client_id: clientId,
                client_secret: clientSecret,
                code,
                redirect_uri: redirectUri,
            }),
        });

        const tokenData = await tokenResponse.json();
        
        if (tokenData.error) {
            console.error('GitHub token error:', tokenData);
            return NextResponse.redirect(new URL('/dashboard/version-control?error=TokenExchangeFailed', request.url));
        }

        const accessToken = tokenData.access_token;

        // Get the current user
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            console.error('Supabase user error:', userError);
            return NextResponse.redirect(new URL('/login?error=NotAuthenticated', request.url));
        }

        const { error: updateError } = await supabase
            .from('users')
            .update({ github_token: accessToken })
            .eq('id', user.id);

        if (updateError) {
            console.error('Supabase update error:', updateError);
            return NextResponse.redirect(new URL('/dashboard/version-control?error=DatabaseUpdateFailed', request.url));
        }

        // Successfully connected
        return NextResponse.redirect(new URL('/dashboard/version-control?github_connected=true', request.url));

    } catch (error) {
        console.error('GitHub callback error:', error);
        return NextResponse.redirect(new URL('/dashboard/version-control?error=InternalError', request.url));
    }
}
