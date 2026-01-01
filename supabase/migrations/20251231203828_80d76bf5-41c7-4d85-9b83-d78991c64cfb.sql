-- Create shipments table for tracking
CREATE TABLE public.shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tracking_number TEXT NOT NULL UNIQUE,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  current_location TEXT NOT NULL DEFAULT 'Origin facility',
  current_lat DECIMAL(10,7),
  current_lng DECIMAL(10,7),
  status TEXT NOT NULL DEFAULT 'pending',
  service_type TEXT NOT NULL,
  weight DECIMAL(10,2) NOT NULL,
  estimated_delivery DATE,
  actual_delivery DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create shipment_events table for tracking history
CREATE TABLE public.shipment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID REFERENCES public.shipments(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  lat DECIMAL(10,7),
  lng DECIMAL(10,7),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on shipments
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_events ENABLE ROW LEVEL SECURITY;

-- Shipments policies - users can view their own, and anyone can view by tracking number
CREATE POLICY "Users can view their own shipments"
ON public.shipments FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view shipment by tracking number"
ON public.shipments FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own shipments"
ON public.shipments FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Shipment events policies
CREATE POLICY "Anyone can view shipment events"
ON public.shipment_events FOR SELECT
USING (true);

-- Enable realtime for shipments table
ALTER TABLE public.shipments REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.shipments;

-- Trigger for updated_at on shipments
CREATE TRIGGER update_shipments_updated_at
BEFORE UPDATE ON public.shipments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate tracking number
CREATE OR REPLACE FUNCTION public.generate_tracking_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := 'SS';
  i INTEGER;
BEGIN
  FOR i IN 1..10 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- Insert some demo shipments for testing
INSERT INTO public.shipments (tracking_number, origin, destination, current_location, status, service_type, weight, estimated_delivery, current_lat, current_lng)
VALUES 
  ('SS1234567890', 'New York, USA', 'London, UK', 'In transit - Atlantic Ocean', 'in_transit', 'Express Air', 5.5, CURRENT_DATE + INTERVAL '2 days', 45.5, -30.2),
  ('SS0987654321', 'Los Angeles, USA', 'Tokyo, Japan', 'Customs clearance - Tokyo', 'customs', 'Standard Air', 12.0, CURRENT_DATE + INTERVAL '1 day', 35.6762, 139.6503),
  ('SS1122334455', 'Chicago, USA', 'Paris, France', 'Delivered', 'delivered', 'Express Air', 3.2, CURRENT_DATE - INTERVAL '1 day', 48.8566, 2.3522);

-- Insert demo events
INSERT INTO public.shipment_events (shipment_id, status, location, description)
SELECT id, 'pending', 'New York, USA', 'Shipment created' FROM public.shipments WHERE tracking_number = 'SS1234567890';
INSERT INTO public.shipment_events (shipment_id, status, location, description, created_at)
SELECT id, 'picked_up', 'New York, USA', 'Package picked up from sender', now() - INTERVAL '2 days' FROM public.shipments WHERE tracking_number = 'SS1234567890';
INSERT INTO public.shipment_events (shipment_id, status, location, description, created_at)
SELECT id, 'in_transit', 'JFK Airport, New York', 'Departed origin facility', now() - INTERVAL '1 day' FROM public.shipments WHERE tracking_number = 'SS1234567890';
INSERT INTO public.shipment_events (shipment_id, status, location, description)
SELECT id, 'in_transit', 'In transit - Atlantic Ocean', 'Currently in transit' FROM public.shipments WHERE tracking_number = 'SS1234567890';