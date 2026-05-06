import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        const eventType = request.headers.get('x-github-event');

        if (eventType === 'ping') {
            return NextResponse.json({ message: 'pong' });
        }

        if (eventType === 'push') {
            const commits = payload.commits;
            const repoFullName = payload.repository.full_name;
            const pusherEmail = payload.pusher?.email;

            if (!pusherEmail || !commits || commits.length === 0) {
                return NextResponse.json({ message: 'No commits or pusher email found' });
            }

            const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
            
            if (authError || !authData.users) {
                return NextResponse.json({ error: 'Failed to map user' }, { status: 500 });
            }

            const matchedAuthUser = authData.users.find(u => u.email === pusherEmail);

            if (!matchedAuthUser) {
                return NextResponse.json({ message: 'No matching user found in Donezo' });
            }

            const userId = matchedAuthUser.id;

            const activities = commits.map((commit: any) => ({
                user_id: userId,
                activity_type: 'commit',
                description: `Pushed to ${repoFullName}: ${commit.message}`,
                reference_id: commit.id,
            }));

            const { error: insertError } = await supabase
                .from('user_activities')
                .insert(activities);

            if (insertError) {
                return NextResponse.json({ error: 'Database insert failed' }, { status: 500 });
            }

            return NextResponse.json({ message: 'Push events recorded' });
        }

        return NextResponse.json({ message: 'Event ignored' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
