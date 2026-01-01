-- Add notification preference columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS notify_shipment_updates boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS notify_quote_reminders boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS notify_promotions boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS notify_newsletters boolean DEFAULT false;