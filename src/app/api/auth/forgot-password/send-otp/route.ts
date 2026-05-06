import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { SignJWT } from 'jose';
import { createClient } from '@supabase/supabase-js';

const JWT_SECRET = new TextEncoder().encode(
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'default-secret-key-must-be-long'
);

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Check if user actually exists
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        
        if (listError) {
            return NextResponse.json({ error: 'Failed to verify user status' }, { status: 500 });
        }

        const userExists = users.some((u) => u.email === email);
        if (!userExists) {
            // Return success anyway to prevent email enumeration attacks
            return NextResponse.json({ success: true });
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Create JWT to store the temporary session
        const token = await new SignJWT({ email, otp })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('10m') // OTP valid for 10 minutes
            .sign(JWT_SECRET);

        // Send Email using Nodemailer
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 465),
            secure: true, 
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <body style="background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px 20px;">
          <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 40px; text-align: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
            <h1 style="color: #111827; font-size: 24px; font-weight: 700; margin-top: 0; margin-bottom: 8px; letter-spacing: -0.5px;">Password Reset</h1>
            <p style="color: #6b7280; font-size: 15px; line-height: 1.5; margin-bottom: 32px;">
              Please use the verification code below to securely log into your Donezo account or reset your password.
            </p>
            <div style="background-color: #f3f4f6; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
              <div style="font-size: 36px; font-weight: 800; color: #111827; letter-spacing: 8px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;">
                ${otp}
              </div>
            </div>
            <p style="color: #9ca3af; font-size: 13px; margin-bottom: 0;">
              If you didn't request this email, you can safely ignore it. Your password will not be changed.
            </p>
          </div>
        </body>
        </html>
        `;

        await transporter.sendMail({
            from: '"Donezo" <' + (process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER) + '>',
            to: email,
            subject: "Your Donezo Password Reset Code",
            html: htmlContent,
        });

        // Return success and set the HTTP-only cookie
        const response = NextResponse.json({ success: true });
        response.cookies.set('temp_forgot_password_session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 10, // 10 minutes
            path: '/',
        });

        return response;
    } catch (error: any) {
        console.error("Error sending OTP via Nodemailer:", error);
        return NextResponse.json({ error: error.message || 'Failed to send email. Check SMTP credentials.' }, { status: 500 });
    }
}
