import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const getStatusUpdateEmail = (data: {
  trackingNumber: string;
  customerName: string;
  origin: string;
  destination: string;
  newStatus: string;
  currentLocation: string;
  estimatedDelivery: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 32px; text-align: center; }
    .header h1 { color: #fbbf24; margin: 0; font-size: 28px; }
    .header p { color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px; }
    .content { padding: 32px; }
    .status-badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 8px 16px; border-radius: 20px; font-weight: 600; font-size: 14px; margin-bottom: 20px; }
    .tracking-number { background: #f1f5f9; padding: 16px; border-radius: 8px; text-align: center; margin-bottom: 24px; }
    .tracking-number span { font-size: 24px; font-weight: 700; color: #0f172a; letter-spacing: 2px; }
    .route { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; padding: 16px; background: #fef2f2; border-radius: 8px; }
    .location { text-align: center; flex: 1; }
    .location-label { font-size: 12px; color: #64748b; text-transform: uppercase; }
    .location-name { font-weight: 600; color: #0f172a; font-size: 16px; margin-top: 4px; }
    .arrow { color: #dc2626; font-size: 24px; padding: 0 16px; }
    .details { background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
    .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #64748b; }
    .detail-value { font-weight: 600; color: #0f172a; }
    .cta { text-align: center; margin-top: 24px; }
    .cta a { display: inline-block; background: #dc2626; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; }
    .footer { background: #f8fafc; padding: 24px; text-align: center; color: #64748b; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📦 Global Embrace</h1>
      <p>Shipment Status Update</p>
    </div>
    <div class="content">
      <p>Hi ${data.customerName},</p>
      <p>Your shipment status has been updated:</p>
      
      <div style="text-align: center;">
        <span class="status-badge">${data.newStatus.replace(/_/g, ' ').toUpperCase()}</span>
      </div>
      
      <div class="tracking-number">
        <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">TRACKING NUMBER</div>
        <span>${data.trackingNumber}</span>
      </div>
      
      <div class="route">
        <div class="location">
          <div class="location-label">From</div>
          <div class="location-name">${data.origin}</div>
        </div>
        <div class="arrow">✈️</div>
        <div class="location">
          <div class="location-label">To</div>
          <div class="location-name">${data.destination}</div>
        </div>
      </div>
      
      <div class="details">
        <div class="detail-row">
          <span class="detail-label">Current Location</span>
          <span class="detail-value">${data.currentLocation}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Estimated Delivery</span>
          <span class="detail-value">${data.estimatedDelivery}</span>
        </div>
      </div>
      
      <div class="cta">
        <a href="https://shp.senacodes.io/tracking?number=${data.trackingNumber}">Track Your Shipment</a>
      </div>
    </div>
    <div class="footer">
      You're receiving this because you have notifications enabled for this shipment.<br>
      © ${new Date().getFullYear()} Global Embrace. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

const getDeliveryCompleteEmail = (data: {
  trackingNumber: string;
  customerName: string;
  origin: string;
  destination: string;
  deliveredAt: string;
}) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 32px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; }
    .header p { color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px; }
    .content { padding: 32px; text-align: center; }
    .checkmark { font-size: 64px; margin-bottom: 16px; }
    .success-text { font-size: 24px; font-weight: 700; color: #16a34a; margin-bottom: 24px; }
    .tracking-number { background: #f1f5f9; padding: 16px; border-radius: 8px; margin-bottom: 24px; }
    .tracking-number span { font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: 2px; }
    .details { background: #f0fdf4; border-radius: 8px; padding: 20px; margin-bottom: 24px; text-align: left; }
    .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #bbf7d0; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #64748b; }
    .detail-value { font-weight: 600; color: #0f172a; }
    .cta { text-align: center; margin-top: 24px; }
    .cta a { display: inline-block; background: #16a34a; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 0 8px; }
    .cta-secondary { background: #f1f5f9 !important; color: #0f172a !important; }
    .footer { background: #f8fafc; padding: 24px; text-align: center; color: #64748b; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📦 Global Embrace</h1>
      <p>Package Delivered!</p>
    </div>
    <div class="content">
      <div class="checkmark">✅</div>
      <div class="success-text">Your package has been delivered!</div>
      
      <p>Hi ${data.customerName}, great news! Your shipment has been successfully delivered.</p>
      
      <div class="tracking-number">
        <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">TRACKING NUMBER</div>
        <span>${data.trackingNumber}</span>
      </div>
      
      <div class="details">
        <div class="detail-row">
          <span class="detail-label">From</span>
          <span class="detail-value">${data.origin}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">To</span>
          <span class="detail-value">${data.destination}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Delivered On</span>
          <span class="detail-value">${data.deliveredAt}</span>
        </div>
      </div>
      
      <p style="color: #64748b; margin-top: 24px;">
        Thank you for choosing Global Embrace! We hope you're satisfied with our service.
      </p>
      
      <div class="cta">
        <a href="https://shp.senacodes.io/contact">Leave Feedback</a>
      </div>
    </div>
    <div class="footer">
      Thank you for shipping with Global Embrace!<br>
      © ${new Date().getFullYear()} Global Embrace. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get pending notifications
    const { data: pendingNotifications, error: fetchError } = await supabase
      .from("notification_logs")
      .select(`
        id,
        shipment_id,
        email,
        notification_type,
        shipments (
          tracking_number,
          origin,
          destination,
          current_location,
          status,
          estimated_delivery,
          actual_delivery,
          customer_name
        )
      `)
      .eq("status", "pending")
      .limit(10);

    if (fetchError) throw fetchError;

    if (!pendingNotifications || pendingNotifications.length === 0) {
      return new Response(
        JSON.stringify({ message: "No pending notifications" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const results = [];

    for (const notification of pendingNotifications) {
      const shipment = notification.shipments as any;
      
      if (!shipment) {
        // Mark as failed if shipment not found
        await supabase
          .from("notification_logs")
          .update({ status: "failed", error_message: "Shipment not found" })
          .eq("id", notification.id);
        continue;
      }

      let emailHtml = "";
      let subject = "";

      if (notification.notification_type === "delivery_complete") {
        subject = `✅ Your package ${shipment.tracking_number} has been delivered!`;
        emailHtml = getDeliveryCompleteEmail({
          trackingNumber: shipment.tracking_number,
          customerName: shipment.customer_name || "Customer",
          origin: shipment.origin,
          destination: shipment.destination,
          deliveredAt: shipment.actual_delivery 
            ? new Date(shipment.actual_delivery).toLocaleDateString("en-US", { 
                weekday: "long", year: "numeric", month: "long", day: "numeric" 
              })
            : new Date().toLocaleDateString("en-US", { 
                weekday: "long", year: "numeric", month: "long", day: "numeric" 
              }),
        });
      } else {
        subject = `📦 Shipment Update: ${shipment.tracking_number} - ${shipment.status.replace(/_/g, " ").toUpperCase()}`;
        emailHtml = getStatusUpdateEmail({
          trackingNumber: shipment.tracking_number,
          customerName: shipment.customer_name || "Customer",
          origin: shipment.origin,
          destination: shipment.destination,
          newStatus: shipment.status,
          currentLocation: shipment.current_location,
          estimatedDelivery: shipment.estimated_delivery
            ? new Date(shipment.estimated_delivery).toLocaleDateString("en-US", {
                weekday: "long", year: "numeric", month: "long", day: "numeric"
              })
            : "TBD",
        });
      }

      // Send email via Resend
      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Global Embrace <notifications@shp.senacodes.io>",
            to: [notification.email],
            subject: subject,
            html: emailHtml,
          }),
        });

        if (emailResponse.ok) {
          // Mark as sent
          await supabase
            .from("notification_logs")
            .update({ status: "sent", sent_at: new Date().toISOString() })
            .eq("id", notification.id);
          
          results.push({ id: notification.id, status: "sent" });
        } else {
          const errorData = await emailResponse.json();
          await supabase
            .from("notification_logs")
            .update({ status: "failed", error_message: JSON.stringify(errorData) })
            .eq("id", notification.id);
          
          results.push({ id: notification.id, status: "failed", error: errorData });
        }
      } catch (emailError) {
        await supabase
          .from("notification_logs")
          .update({ status: "failed", error_message: String(emailError) })
          .eq("id", notification.id);
        
        results.push({ id: notification.id, status: "failed", error: String(emailError) });
      }
    }

    return new Response(
      JSON.stringify({ processed: results.length, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing notifications:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
