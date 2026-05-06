-- Donezo Database Schema (Supabase / PostgreSQL)
-- Designed for Supabase, utilizing auth.users and Row Level Security (RLS)

-- ENUMS
CREATE TYPE project_status AS ENUM ('Active', 'On Hold', 'Completed');
CREATE TYPE task_priority AS ENUM ('Low', 'Medium', 'High');
CREATE TYPE task_status AS ENUM ('Todo', 'In Progress', 'In Review', 'Done');
CREATE TYPE user_status AS ENUM ('Active', 'Idle', 'Offline');
CREATE TYPE timeline_status AS ENUM ('Active', 'Failed', 'Completed', 'Renewed');

-- USERS (Extends Supabase auth.users)
-- Note: Email and passwords are automatically handled by the Supabase auth.users table.
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) DEFAULT 'Developer',
    avatar_url TEXT,
    status user_status DEFAULT 'Offline',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROJECTS
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status project_status DEFAULT 'Active',
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROJECT MEMBERS
CREATE TABLE public.project_members (
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (project_id, user_id)
);

-- TASKS (Kanban & Timeline items)
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority task_priority DEFAULT 'Medium',
    status task_status DEFAULT 'Todo',
    due_date DATE,
    start_date DATE,
    end_date DATE,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TASK ASSIGNEES
CREATE TABLE public.task_assignees (
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (task_id, user_id)
);

-- TASK COMMENTS
CREATE TABLE public.task_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TASK ATTACHMENTS (Links to Supabase Storage)
CREATE TABLE public.task_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size_bytes BIGINT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TIMELINE NODES (Sprint / Phase Tracking)
CREATE TABLE public.timeline_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status timeline_status DEFAULT 'Active',
    horizon_date TIMESTAMPTZ NOT NULL,
    workload_days INTEGER DEFAULT 0,
    last_touched_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- GAMIFICATION: DEVELOPER SCORES
CREATE TABLE public.developer_scores (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    consistency_score INTEGER DEFAULT 0,
    efficiency_score INTEGER DEFAULT 0,
    execution_score INTEGER DEFAULT 0,
    impact_score INTEGER DEFAULT 0,
    total_score INTEGER GENERATED ALWAYS AS (consistency_score + efficiency_score + execution_score + impact_score) STORED,
    last_calculated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ACTIVITY LOGS (For sparklines & "Recent Commit")
CREATE TABLE public.user_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- 'commit', 'task_completed', etc.
    description TEXT,
    reference_id VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS)
-- Enabling RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_assignees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- DEFAULT RLS POLICIES (Development Mode: Allow all for authenticated users)
-- Note: You should restrict these further based on project membership in production!
CREATE POLICY "Allow authenticated full access to users" ON public.users FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access to projects" ON public.projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access to project_members" ON public.project_members FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access to tasks" ON public.tasks FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access to task_assignees" ON public.task_assignees FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access to task_comments" ON public.task_comments FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access to task_attachments" ON public.task_attachments FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access to timeline_nodes" ON public.timeline_nodes FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access to developer_scores" ON public.developer_scores FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated full access to user_activities" ON public.user_activities FOR ALL TO authenticated USING (true);

-- INDEXES FOR PERFORMANCE
CREATE INDEX idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX idx_timeline_nodes_project_id ON public.timeline_nodes(project_id);
CREATE INDEX idx_user_activities_user_id_date ON public.user_activities(user_id, created_at DESC);

-- FUNCTION: Auto-update updated_at columns
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGERS: Attach auto-update function to tables with updated_at
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_projects_modtime BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_tasks_modtime BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_task_comments_modtime BEFORE UPDATE ON public.task_comments FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_timeline_nodes_modtime BEFORE UPDATE ON public.timeline_nodes FOR EACH ROW EXECUTE FUNCTION update_modified_column();
