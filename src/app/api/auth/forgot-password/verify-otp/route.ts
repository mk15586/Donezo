import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const JWT_SECRET = new TextEncoder().encode(
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'default-secret-key-must-be-long'
);

export async function POST(request: Request) {
    try {
        const { otp } = await request.json();
        
        // Read the HTTP-only cookie
        const cookieStore = await cookies();
        const token = cookieStore.get('temp_forgot_password_session')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Session expired or invalid. Please request a new code.' }, { status: 401 });
        }

        let payload;
        try {
            const verified = await jwtVerify(token, JWT_SECRET);
            payload = verified.payload as any;
        } catch (err) {
            return NextResponse.json({ error: 'Session expired or invalid. Please request a new code.' }, { status: 401 });
        }

        // Verify OTP
        if (payload.otp !== otp) {
            return NextResponse.json({ error: 'Invalid verification code. Please try again.' }, { status: 400 });
        }

        // OTP Matches! 
        // We now use the magic link hack to generate a secure session token for the client
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: payload.email,
        });

        if (linkError || !linkData.properties?.action_link) {
            console.error("Generate Link Error:", linkError);
            return NextResponse.json({ error: 'Failed to generate secure session' }, { status: 500 });
        }

        // Extract the raw token from the generated action link
        // Example URL: https://[project].supabase.co/auth/v1/verify?token=pkce_token&type=magiclink&redirect_to=...
        const actionLink = new URL(linkData.properties.action_link);
        const magicLinkToken = actionLink.searchParams.get('token');

        if (!magicLinkToken) {
            return NextResponse.json({ error: 'Failed to extract secure token' }, { status: 500 });
        }

        const response = NextResponse.json({ 
            success: true, 
            email: payload.email,
            magicLinkToken: magicLinkToken
        });
        
        // Clear the temporary cookie
        response.cookies.delete('temp_forgot_password_session');

        return response;

    } catch (error: any) {
        console.error("Error verifying custom OTP:", error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
