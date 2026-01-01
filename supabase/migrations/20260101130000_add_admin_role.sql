-- Add is_admin column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create index for admin queries
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin) WHERE is_admin = true;

-- Create a view for admin to see all shipments with user info
CREATE OR REPLACE VIEW public.admin_shipments_view AS
SELECT 
  s.*,
  p.email as user_email,
  p.company_name as user_company,
  p.phone as user_phone
FROM public.shipments s
LEFT JOIN public.profiles p ON s.user_id = p.user_id;

-- Grant access to authenticated users (RLS will handle the rest)
GRANT SELECT ON public.admin_shipments_view TO authenticated;

-- Create admin policy for shipments (admins can view all)
CREATE POLICY "Admins can view all shipments" ON public.shipments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Create admin policy for updating shipments
CREATE POLICY "Admins can update all shipments" ON public.shipments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Create admin policy for shipment_events (admins can insert for any shipment)
CREATE POLICY "Admins can insert shipment events" ON public.shipment_events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Create admin policy for viewing all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() 
      AND p.is_admin = true
    )
  );

-- Create admin policy for viewing all saved quotes
CREATE POLICY "Admins can view all quotes" ON public.saved_quotes
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.is_admin = true
    )
  );
