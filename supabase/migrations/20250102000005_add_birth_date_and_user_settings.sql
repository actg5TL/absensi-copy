-- Add missing columns to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS gender VARCHAR(10);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS language VARCHAR(5) DEFAULT 'en';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS nik VARCHAR(16);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS custom_user_id VARCHAR(8);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS public.user_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  notifications_enabled boolean DEFAULT true,
  email_notifications boolean DEFAULT true,
  location_tracking boolean DEFAULT true,
  dark_mode boolean DEFAULT false,
  language varchar(5) DEFAULT 'en',
  timezone varchar(50) DEFAULT 'UTC',
  auto_checkout boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id)
);

-- RLS policies for user_settings
DROP POLICY IF EXISTS "Users can manage own settings" ON public.user_settings;
CREATE POLICY "Users can manage own settings"
ON public.user_settings FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add unique constraint for custom_user_id (only if it doesn't exist)
DO $ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_custom_user_id'
    ) THEN
        ALTER TABLE public.users ADD CONSTRAINT unique_custom_user_id UNIQUE (custom_user_id);
    END IF;
END $;
