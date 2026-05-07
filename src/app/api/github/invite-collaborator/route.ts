import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
    try {
        const { project_id, github_username, avatar_url } = await request.json();

        if (!project_id || !github_username) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // Verify the user is actually a member of this project
        const { data: memberCheck } = await supabase
            .from('project_members')
            .select('*')
            .eq('project_id', project_id)
            .eq('user_id', user.id)
            .single();

        if (!memberCheck) {
            return NextResponse.json({ error: 'Not authorized for this project' }, { status: 403 });
        }

        const { data, error } = await supabase
            .from('project_github_collaborators')
            .insert({
                project_id,
                github_username,
                avatar_url,
                status: 'Invite Pending'
            })
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                return NextResponse.json({ error: 'User is already invited to this project' }, { status: 400 });
            }
            throw error;
        }

        return NextResponse.json({ success: true, data });

    } catch (error: any) {
        console.error('Invite collaborator error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
