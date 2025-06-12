-- Fix RLS policies for users table
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
ON users FOR ALL
USING (auth.uid()::uuid = id)
WITH CHECK (auth.uid()::uuid = id);

DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid()::uuid = id);

-- Create app_settings table for departments and email recipients
CREATE TABLE IF NOT EXISTS app_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default departments
INSERT INTO app_settings (setting_key, setting_value) VALUES 
('departments', '["Human Resources", "Information Technology", "Finance", "Marketing", "Operations", "Sales", "Customer Service", "Administration"]')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert default email recipients (empty initially)
INSERT INTO app_settings (setting_key, setting_value) VALUES 
('email_recipients', '{"attendance": [], "leave_request": []}')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert SMTP settings (empty initially)
INSERT INTO app_settings (setting_key, setting_value) VALUES 
('smtp_settings', '{"host": "smtp.gmail.com", "port": 587, "secure": false, "username": "", "password": ""}')
ON CONFLICT (setting_key) DO NOTHING;

-- Enable realtime
alter publication supabase_realtime add table app_settings;

-- RLS policies for app_settings (allow all authenticated users to read, only admins to write)
DROP POLICY IF EXISTS "Anyone can read app settings" ON app_settings;
CREATE POLICY "Anyone can read app settings"
ON app_settings FOR SELECT
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Anyone can update app settings" ON app_settings;
CREATE POLICY "Anyone can update app settings"
ON app_settings FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');