import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface BookingRequestData {
  quoteId: string;
  origin: string;
  destination: string;
  service: string;
  price: number;
  deliveryDays: string;
  weight: number;
  userEmail: string;
  userName?: string;
  userPhone?: string;
}

const getTeamNotificationEmail = (data: BookingRequestData) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 0;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626, #991b1b); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🚀 New Booking Request!</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <p style="color: #374151; font-size: 16px; margin: 0 0 20px 0;">
                A customer has requested a callback for a shipment booking. Please contact them as soon as possible.
              </p>
              
              <!-- Customer Info -->
              <div style="background: #fef2f2; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <h2 style="color: #991b1b; margin: 0 0 15px 0; font-size: 18px;">📞 Customer Contact</h2>
                <p style="margin: 5px 0; color: #374151;"><strong>Email:</strong> ${data.userEmail}</p>
                ${data.userName ? `<p style="margin: 5px 0; color: #374151;"><strong>Name:</strong> ${data.userName}</p>` : ''}
                ${data.userPhone ? `<p style="margin: 5px 0; color: #374151;"><strong>Phone:</strong> ${data.userPhone}</p>` : ''}
              </div>
              
              <!-- Shipment Details -->
              <div style="background: #f9fafb; border-radius: 8px; padding: 20px;">
                <h2 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">📦 Shipment Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Route</td>
                    <td style="padding: 8px 0; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #e5e7eb;">${data.origin} → ${data.destination}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Service</td>
                    <td style="padding: 8px 0; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #e5e7eb;">${data.service}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Weight</td>
                    <td style="padding: 8px 0; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #e5e7eb;">${data.weight} kg</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Delivery Time</td>
                    <td style="padding: 8px 0; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #e5e7eb;">${data.deliveryDays} days</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Quoted Price</td>
                    <td style="padding: 8px 0; color: #dc2626; font-weight: 700; text-align: right; font-size: 18px;">$${data.price.toFixed(2)}</td>
                  </tr>
                </table>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
                Quote ID: ${data.quoteId}
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                Global Embrace Logistics - Internal Notification
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const getCustomerConfirmationEmail = (data: BookingRequestData, userName: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 0;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #dc2626, #991b1b); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">📞 Callback Requested!</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <p style="color: #374151; font-size: 16px; margin: 0 0 20px 0;">
                Hi ${userName || 'there'},
              </p>
              <p style="color: #374151; font-size: 16px; margin: 0 0 20px 0;">
                Thank you for your booking request! Our team has received your shipment details and will contact you shortly to finalize your booking.
              </p>
              
              <!-- Shipment Summary -->
              <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <h2 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">📦 Your Shipment Summary</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Route</td>
                    <td style="padding: 8px 0; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #e5e7eb;">${data.origin} → ${data.destination}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Service</td>
                    <td style="padding: 8px 0; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #e5e7eb;">${data.service}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; border-bottom: 1px solid #e5e7eb;">Estimated Delivery</td>
                    <td style="padding: 8px 0; color: #111827; font-weight: 600; text-align: right; border-bottom: 1px solid #e5e7eb;">${data.deliveryDays} days</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280;">Quoted Price</td>
                    <td style="padding: 8px 0; color: #dc2626; font-weight: 700; text-align: right; font-size: 18px;">$${data.price.toFixed(2)}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin-bottom: 20px;">
                <p style="color: #991b1b; font-size: 14px; margin: 0;">
                  <strong>What's next?</strong><br>
                  A member of our team will call you within 24 hours to confirm your booking details and arrange pickup.
                </p>
              </div>
              
              <p style="color: #374151; font-size: 16px; margin: 0;">
                If you have any questions in the meantime, feel free to reply to this email or call us at <strong>1-800-SWIFT-SHIP</strong>.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                © 2025 Global Embrace Logistics. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const handler = async (req: Request): Promise<Response> => {
  console.log("Booking request function called");
  
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const bookingData: BookingRequestData = await req.json();
    console.log("Booking data received:", bookingData);

    // Validate required fields
    if (!bookingData.quoteId || !bookingData.userEmail) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Update quote status to 'callback_requested'
    const { error: updateError } = await supabase
      .from("saved_quotes")
      .update({ status: "callback_requested" })
      .eq("id", bookingData.quoteId);

    if (updateError) {
      console.error("Error updating quote status:", updateError);
      throw updateError;
    }
    console.log("Quote status updated to callback_requested");

    // Send email to team
    const teamEmailResult = await resend.emails.send({
      from: "Global Embrace <onboarding@resend.dev>",
      to: ["support@globalembrace.com"], // This should be your actual support email
      subject: `New Booking Request - ${bookingData.origin} to ${bookingData.destination}`,
      html: getTeamNotificationEmail(bookingData),
    });
    console.log("Team notification email result:", teamEmailResult);

    // Send confirmation email to customer
    const customerEmailResult = await resend.emails.send({
      from: "Global Embrace <onboarding@resend.dev>",
      to: [bookingData.userEmail],
      subject: "Your Booking Request Has Been Received!",
      html: getCustomerConfirmationEmail(bookingData, bookingData.userName || ""),
    });
    console.log("Customer confirmation email result:", customerEmailResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Booking request submitted successfully" 
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  } catch (error: any) {
    console.error("Error in booking-request function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
};

serve(handler);
