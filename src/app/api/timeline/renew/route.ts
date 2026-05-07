import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
    try {
        const { nodeId, startDate, horizonDate } = await request.json();

        if (!nodeId || !startDate || !horizonDate) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // Fetch original node
        const { data: oldNode, error: fetchError } = await supabase
            .from('timeline_nodes')
            .select('*')
            .eq('id', nodeId)
            .single();

        if (fetchError || !oldNode) {
            return NextResponse.json({ error: 'Node not found' }, { status: 404 });
        }

        // Verify user has access to this project
        const { data: memberCheck } = await supabase
            .from('project_members')
            .select('*')
            .eq('project_id', oldNode.project_id)
            .eq('user_id', user.id)
            .single();

        if (!memberCheck) {
            return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
        }

        const start = new Date(startDate);
        const newHorizon = new Date(horizonDate);
        const oldHorizon = new Date(oldNode.horizon_date);

        // Calculate Workload (days between start and new horizon)
        const workloadDays = Math.max(1, Math.ceil((newHorizon.getTime() - start.getTime()) / (1000 * 3600 * 24)));

        // Calculate Penalty: Base 50 + 10 per day extended beyond original deadline
        let penalty = 50;
        const extraDays = Math.ceil((newHorizon.getTime() - oldHorizon.getTime()) / (1000 * 3600 * 24));
        if (extraDays > 0) {
            penalty += (extraDays * 10);
        }

        // 1. Mark old node as Renewed
        await supabase
            .from('timeline_nodes')
            .update({ status: 'Renewed', updated_at: new Date().toISOString() })
            .eq('id', nodeId);

        // 2. Create new child node
        const { data: newNode, error: insertError } = await supabase
            .from('timeline_nodes')
            .insert({
                project_id: oldNode.project_id,
                title: oldNode.title,
                description: oldNode.description,
                start_date: start.toISOString(),
                horizon_date: newHorizon.toISOString(),
                workload_days: workloadDays,
                status: 'Active',
                parent_id: nodeId,
                penalty_points: penalty
            })
            .select()
            .single();

        if (insertError) throw insertError;

        return NextResponse.json({ success: true, data: newNode });

    } catch (error: any) {
        console.error('Renew node error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
