-- Add UPDATE policy for saved_quotes so users can update their quote status
CREATE POLICY "Users can update their own quotes" 
ON public.saved_quotes 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);