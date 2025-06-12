-- Create attendance_records table
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type text NOT NULL CHECK (type IN ('check-in', 'check-out')),
    timestamp timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    location text,
    latitude double precision,
    longitude double precision,
    status text NOT NULL DEFAULT 'verified' CHECK (status IN ('verified', 'pending')),
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create leave_requests table
CREATE TABLE IF NOT EXISTS public.leave_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    department text NOT NULL,
    leave_type text NOT NULL,
    reason text NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    additional_details text,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_attendance_records_user_id ON public.attendance_records(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_timestamp ON public.attendance_records(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_leave_requests_user_id ON public.leave_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON public.leave_requests(status);

-- Enable realtime for both tables
alter publication supabase_realtime add table attendance_records;
alter publication supabase_realtime add table leave_requests;

-- Create RLS policies for attendance_records
DROP POLICY IF EXISTS "Users can view own attendance records" ON public.attendance_records;
CREATE POLICY "Users can view own attendance records"
ON public.attendance_records FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own attendance records" ON public.attendance_records;
CREATE POLICY "Users can insert own attendance records"
ON public.attendance_records FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own attendance records" ON public.attendance_records;
CREATE POLICY "Users can update own attendance records"
ON public.attendance_records FOR UPDATE
USING (auth.uid() = user_id);

-- Create RLS policies for leave_requests
DROP POLICY IF EXISTS "Users can view own leave requests" ON public.leave_requests;
CREATE POLICY "Users can view own leave requests"
ON public.leave_requests FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own leave requests" ON public.leave_requests;
CREATE POLICY "Users can insert own leave requests"
ON public.leave_requests FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own leave requests" ON public.leave_requests;
CREATE POLICY "Users can update own leave requests"
ON public.leave_requests FOR UPDATE
USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS handle_updated_at_attendance_records ON public.attendance_records;
CREATE TRIGGER handle_updated_at_attendance_records
    BEFORE UPDATE ON public.attendance_records
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_updated_at_leave_requests ON public.leave_requests;
CREATE TRIGGER handle_updated_at_leave_requests
    BEFORE UPDATE ON public.leave_requests
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
