import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "quote_saved" | "booking_confirmed" | "status_update" | "delivery_complete";
  email: string;
  data: {
    origin: string;
    destination: string;
    service: string;
    price: number;
    deliveryDays: string;
    weight: number;
    trackingNumber?: string;
    newStatus?: string;
    statusDescription?: string;
    estimatedDelivery?: string;
  };
}

const getQuoteSavedEmail = (data: EmailRequest["data"]) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px; text-align: center; }
    .header h1 { color: #f59e0b; margin: 0; font-size: 28px; }
    .header p { color: rgba(255,255,255,0.7); margin: 8px 0 0; }
    .content { padding: 32px; }
    .route { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 24px; }
    .location { text-align: center; }
    .location-name { font-weight: 600; color: #0f172a; font-size: 18px; }
    .arrow { color: #f59e0b; font-size: 24px; }
    .details { background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #64748b; }
    .detail-value { font-weight: 600; color: #0f172a; }
    .price { text-align: center; margin: 24px 0; }
    .price-amount { font-size: 36px; font-weight: 700; color: #f59e0b; }
    .cta { text-align: center; margin-top: 24px; }
    .cta a { display: inline-block; background: #f59e0b; color: #0f172a; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; }
    .footer { background: #f8fafc; padding: 24px; text-align: center; color: #64748b; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📦 Global Embrace</h1>
      <p>Your Quote Has Been Saved</p>
    </div>
    <div class="content">
      <div class="route">
        <div class="location">
          <div class="location-name">${data.origin}</div>
        </div>
        <div class="arrow">→</div>
        <div class="location">
          <div class="location-name">${data.destination}</div>
        </div>
      </div>
      <div class="details">
        <div class="detail-row">
          <span class="detail-label">Service</span>
          <span class="detail-value">${data.service}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Delivery Time</span>
          <span class="detail-value">${data.deliveryDays} business days</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Weight</span>
          <span class="detail-value">${data.weight} kg</span>
        </div>
      </div>
      <div class="price">
        <div class="price-amount">$${data.price.toFixed(2)}</div>
        <div style="color: #64748b; margin-top: 4px;">Estimated Total</div>
      </div>
      <div class="cta">
        <a href="#">View Your Dashboard</a>
      </div>
    </div>
    <div class="footer">
      This quote is valid for 7 days. Prices may vary based on actual measurements.<br>
      © ${new Date().getFullYear()} Global Embrace. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

const getBookingConfirmedEmail = (data: EmailRequest["data"]) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 32px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; }
    .header p { color: rgba(255,255,255,0.9); margin: 8px 0 0; }
    .check-icon { font-size: 48px; margin-bottom: 12px; }
    .content { padding: 32px; }
    .tracking { background: #f0fdf4; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center; border: 2px dashed #10b981; }
    .tracking-label { color: #166534; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
    .tracking-number { font-size: 24px; font-weight: 700; color: #059669; font-family: monospace; margin-top: 4px; }
    .route { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 24px; }
    .location { text-align: center; }
    .location-name { font-weight: 600; color: #0f172a; font-size: 18px; }
    .arrow { color: #059669; font-size: 24px; }
    .details { background: #f0fdf4; border-radius: 8px; padding: 20px; margin-bottom: 24px; border: 1px solid #bbf7d0; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #bbf7d0; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #166534; }
    .detail-value { font-weight: 600; color: #0f172a; }
    .price { text-align: center; margin: 24px 0; }
    .price-amount { font-size: 36px; font-weight: 700; color: #059669; }
    .next-steps { background: #f8fafc; border-radius: 8px; padding: 20px; }
    .next-steps h3 { margin: 0 0 12px; color: #0f172a; }
    .next-steps ul { margin: 0; padding-left: 20px; color: #64748b; }
    .next-steps li { margin: 8px 0; }
    .cta { text-align: center; margin-top: 24px; }
    .cta a { display: inline-block; background: #059669; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; }
    .footer { background: #f8fafc; padding: 24px; text-align: center; color: #64748b; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="check-icon">✓</div>
      <h1>Booking Confirmed!</h1>
      <p>Your shipment has been scheduled</p>
    </div>
    <div class="content">
      ${data.trackingNumber ? `
      <div class="tracking">
        <div class="tracking-label">Your Tracking Number</div>
        <div class="tracking-number">${data.trackingNumber}</div>
      </div>
      ` : ''}
      <div class="route">
        <div class="location">
          <div class="location-name">${data.origin}</div>
        </div>
        <div class="arrow">→</div>
        <div class="location">
          <div class="location-name">${data.destination}</div>
        </div>
      </div>
      <div class="details">
        <div class="detail-row">
          <span class="detail-label">Service</span>
          <span class="detail-value">${data.service}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Estimated Delivery</span>
          <span class="detail-value">${data.deliveryDays} business days</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Package Weight</span>
          <span class="detail-value">${data.weight} kg</span>
        </div>
      </div>
      <div class="price">
        <div class="price-amount">$${data.price.toFixed(2)}</div>
        <div style="color: #64748b; margin-top: 4px;">Total Charged</div>
      </div>
      <div class="next-steps">
        <h3>What's Next?</h3>
        <ul>
          <li>Track your package using the tracking number above</li>
          <li>You'll receive updates as your shipment progresses</li>
          <li>Contact support if you have any questions</li>
        </ul>
      </div>
      <div class="cta">
        <a href="https://globalembrace.com/tracking">Track Your Shipment</a>
      </div>
    </div>
    <div class="footer">
      Questions? Contact us at support@globalembrace.com<br>
      © ${new Date().getFullYear()} Global Embrace. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

const getStatusUpdateEmail = (data: EmailRequest["data"]) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 32px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; }
    .header p { color: rgba(255,255,255,0.9); margin: 8px 0 0; }
    .truck-icon { font-size: 48px; margin-bottom: 12px; }
    .content { padding: 32px; }
    .tracking { background: #eff6ff; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center; border: 2px dashed #3b82f6; }
    .tracking-label { color: #1e40af; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
    .tracking-number { font-size: 24px; font-weight: 700; color: #3b82f6; font-family: monospace; margin-top: 4px; }
    .status-box { background: #eff6ff; border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center; }
    .status-label { color: #1e40af; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .status-value { font-size: 28px; font-weight: 700; color: #3b82f6; text-transform: capitalize; }
    .status-description { color: #64748b; margin-top: 8px; }
    .route { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 24px; }
    .location { text-align: center; }
    .location-name { font-weight: 600; color: #0f172a; font-size: 16px; }
    .arrow { color: #3b82f6; font-size: 24px; }
    .cta { text-align: center; margin-top: 24px; }
    .cta a { display: inline-block; background: #3b82f6; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; }
    .footer { background: #f8fafc; padding: 24px; text-align: center; color: #64748b; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="truck-icon">🚚</div>
      <h1>Shipment Update</h1>
      <p>Your package is on the move!</p>
    </div>
    <div class="content">
      <div class="tracking">
        <div class="tracking-label">Tracking Number</div>
        <div class="tracking-number">${data.trackingNumber || 'N/A'}</div>
      </div>
      <div class="status-box">
        <div class="status-label">Current Status</div>
        <div class="status-value">${data.newStatus?.replace(/_/g, ' ') || 'In Transit'}</div>
        ${data.statusDescription ? `<div class="status-description">${data.statusDescription}</div>` : ''}
      </div>
      <div class="route">
        <div class="location">
          <div class="location-name">${data.origin}</div>
        </div>
        <div class="arrow">→</div>
        <div class="location">
          <div class="location-name">${data.destination}</div>
        </div>
      </div>
      ${data.estimatedDelivery ? `
      <div style="text-align: center; padding: 16px; background: #f8fafc; border-radius: 8px; margin-bottom: 24px;">
        <div style="color: #64748b; font-size: 14px;">Estimated Delivery</div>
        <div style="font-size: 20px; font-weight: 600; color: #0f172a;">${data.estimatedDelivery}</div>
      </div>
      ` : ''}
      <div class="cta">
        <a href="https://globalembrace.com/tracking">Track Full Journey</a>
      </div>
    </div>
    <div class="footer">
      Questions? Contact us at support@globalembrace.com<br>
      © ${new Date().getFullYear()} Global Embrace. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

const getDeliveryCompleteEmail = (data: EmailRequest["data"]) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 32px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; }
    .header p { color: rgba(255,255,255,0.9); margin: 8px 0 0; }
    .party-icon { font-size: 48px; margin-bottom: 12px; }
    .content { padding: 32px; }
    .success-box { background: #f0fdf4; border-radius: 12px; padding: 32px; margin-bottom: 24px; text-align: center; border: 2px solid #10b981; }
    .success-icon { font-size: 64px; margin-bottom: 16px; }
    .success-text { font-size: 24px; font-weight: 700; color: #059669; }
    .success-subtext { color: #64748b; margin-top: 8px; }
    .tracking { background: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center; }
    .tracking-label { color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
    .tracking-number { font-size: 18px; font-weight: 600; color: #0f172a; font-family: monospace; margin-top: 4px; }
    .route { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 24px; }
    .location { text-align: center; }
    .location-name { font-weight: 600; color: #0f172a; font-size: 16px; }
    .arrow { color: #10b981; font-size: 24px; }
    .feedback { background: #f8fafc; border-radius: 8px; padding: 20px; text-align: center; }
    .feedback h3 { margin: 0 0 8px; color: #0f172a; }
    .feedback p { color: #64748b; margin: 0 0 16px; }
    .stars { font-size: 32px; }
    .footer { background: #f8fafc; padding: 24px; text-align: center; color: #64748b; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="party-icon">🎉</div>
      <h1>Package Delivered!</h1>
      <p>Your shipment has arrived</p>
    </div>
    <div class="content">
      <div class="success-box">
        <div class="success-icon">📦✓</div>
        <div class="success-text">Delivery Complete</div>
        <div class="success-subtext">Your package has been successfully delivered</div>
      </div>
      <div class="tracking">
        <div class="tracking-label">Tracking Number</div>
        <div class="tracking-number">${data.trackingNumber || 'N/A'}</div>
      </div>
      <div class="route">
        <div class="location">
          <div class="location-name">${data.origin}</div>
        </div>
        <div class="arrow">→</div>
        <div class="location">
          <div class="location-name">${data.destination}</div>
        </div>
      </div>
      <div class="feedback">
        <h3>How was your experience?</h3>
        <p>We'd love to hear your feedback</p>
        <div class="stars">⭐⭐⭐⭐⭐</div>
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
    const { type, email, data }: EmailRequest = await req.json();
    
    console.log(`Sending ${type} email to ${email}`);

    let subject: string;
    let html: string;

    switch (type) {
      case "quote_saved":
        subject = `Your Global Embrace Quote: ${data.origin} → ${data.destination}`;
        html = getQuoteSavedEmail(data);
        break;
      case "booking_confirmed":
        subject = `Booking Confirmed: ${data.origin} → ${data.destination}${data.trackingNumber ? ` | ${data.trackingNumber}` : ''}`;
        html = getBookingConfirmedEmail(data);
        break;
      case "status_update":
        subject = `Shipment Update: ${data.trackingNumber || 'Your Package'} - ${(data.newStatus || 'In Transit').replace(/_/g, ' ')}`;
        html = getStatusUpdateEmail(data);
        break;
      case "delivery_complete":
        subject = `🎉 Delivered: ${data.trackingNumber || 'Your Package'} has arrived!`;
        html = getDeliveryCompleteEmail(data);
        break;
      default:
        throw new Error(`Unknown email type: ${type}`);
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Global Embrace <onboarding@resend.dev>",
        to: [email],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Resend error:", errorData);
      throw new Error(`Email sending failed: ${res.status}`);
    }

    console.log(`Email sent successfully to ${email}`);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error sending email:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
