-- =====================================================
-- LIVE CHAT TABLES
-- =====================================================

-- Create chat_conversations table
CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT,
  user_name TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'closed')),
  assigned_agent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  subject TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  closed_at TIMESTAMP WITH TIME ZONE
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'agent', 'system', 'bot')),
  sender_name TEXT,
  content TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON public.chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_status ON public.chat_conversations(status);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_agent ON public.chat_conversations(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation ON public.chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON public.chat_messages(created_at);

-- Enable RLS
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_conversations
CREATE POLICY "Users can view own conversations" ON public.chat_conversations
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can create conversations" ON public.chat_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update conversations" ON public.chat_conversations
  FOR UPDATE USING (public.is_admin());

-- RLS Policies for chat_messages
CREATE POLICY "Users can view messages in their conversations" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_conversations 
      WHERE id = conversation_id 
      AND (user_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "Users can send messages to their conversations" ON public.chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_conversations 
      WHERE id = conversation_id 
      AND (user_id = auth.uid() OR public.is_admin())
    )
  );

-- Enable realtime for chat
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;

-- =====================================================
-- EMAIL NOTIFICATION TRIGGER FOR SHIPMENT UPDATES
-- =====================================================

-- Add email column to shipments if it doesn't exist
ALTER TABLE public.shipments 
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS notify_on_update BOOLEAN DEFAULT true;

-- Create a table to log notification history
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID REFERENCES public.shipments(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  notification_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on notification_logs
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view notification logs" ON public.notification_logs
  FOR SELECT USING (public.is_admin());

CREATE POLICY "System can insert notification logs" ON public.notification_logs
  FOR INSERT WITH CHECK (true);

-- Create function to queue email notification on shipment status change
CREATE OR REPLACE FUNCTION public.notify_shipment_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email TEXT;
  user_name TEXT;
BEGIN
  -- Only trigger on status change
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  -- Get email from shipment or from user profile
  IF NEW.customer_email IS NOT NULL THEN
    user_email := NEW.customer_email;
    user_name := COALESCE(NEW.customer_name, 'Customer');
  ELSIF NEW.user_id IS NOT NULL THEN
    SELECT p.email, COALESCE(p.company_name, 'Customer')
    INTO user_email, user_name
    FROM public.profiles p
    WHERE p.user_id = NEW.user_id;
  END IF;

  -- Skip if no email or notifications disabled
  IF user_email IS NULL OR NEW.notify_on_update = false THEN
    RETURN NEW;
  END IF;

  -- Insert notification log (will be processed by a scheduled function)
  INSERT INTO public.notification_logs (
    shipment_id,
    email,
    notification_type,
    status
  ) VALUES (
    NEW.id,
    user_email,
    CASE 
      WHEN NEW.status = 'delivered' THEN 'delivery_complete'
      ELSE 'status_update'
    END,
    'pending'
  );

  RETURN NEW;
END;
$$;

-- Create trigger for shipment status changes
DROP TRIGGER IF EXISTS on_shipment_status_change ON public.shipments;
CREATE TRIGGER on_shipment_status_change
  AFTER UPDATE ON public.shipments
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_shipment_status_change();

-- =====================================================
-- UPDATE EXISTING DEMO SHIPMENTS WITH EMAIL
-- =====================================================

-- Add customer email to demo shipments for testing
UPDATE public.shipments 
SET customer_email = 'customer@example.com', 
    customer_name = 'Demo Customer',
    notify_on_update = true
WHERE tracking_number LIKE 'GE%';
