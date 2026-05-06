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
        const token = cookieStore.get('temp_signup_session')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Session expired or invalid. Please refresh and try again.' }, { status: 401 });
        }

        let payload;
        try {
            const verified = await jwtVerify(token, JWT_SECRET);
            payload = verified.payload as any;
        } catch (err) {
            return NextResponse.json({ error: 'Session expired or invalid. Please refresh and try again.' }, { status: 401 });
        }

        // Verify OTP
        if (payload.otp !== otp) {
            return NextResponse.json({ error: 'Invalid verification code. Please try again.' }, { status: 400 });
        }

        // OTP Matches! 
        // We now bypass the unconfirmed state and force-create the user in Supabase
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // admin.createUser directly confirms the email if email_confirm is true
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: payload.email,
            password: payload.password,
            email_confirm: true,
        });

        // If the user already existed and we couldn't create them, handle it
        if (authError) {
            return NextResponse.json({ error: authError.message }, { status: 400 });
        }

        // Insert into our public.users table with the confirmed auth id
        if (authData.user) {
            const { error: profileError } = await supabaseAdmin.from('users').insert({
                id: authData.user.id,
                name: `${payload.firstName} ${payload.lastName}`,
                role: 'Developer',
                status: 'Active'
            });
            
            if (profileError && profileError.code !== '23505') {
                console.error("Error creating public profile:", profileError);
            }
        }

        // Return the credentials so the client can immediately log them in
        const response = NextResponse.json({ 
            success: true, 
            email: payload.email,
            password: payload.password
        });
        
        // Clear the temporary signup cookie
        response.cookies.delete('temp_signup_session');

        return response;

    } catch (error: any) {
        console.error("Error verifying custom OTP:", error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
