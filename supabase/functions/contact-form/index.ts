import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}

const getContactFormEmail = (data: ContactFormRequest) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px; text-align: center; }
    .header h1 { color: #f59e0b; margin: 0; font-size: 24px; }
    .header p { color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 14px; }
    .content { padding: 32px; }
    .field { margin-bottom: 20px; }
    .field-label { color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .field-value { color: #0f172a; font-size: 16px; font-weight: 500; }
    .message-box { background: #f8fafc; border-radius: 8px; padding: 20px; margin-top: 24px; border-left: 4px solid #f59e0b; }
    .message-box h3 { margin: 0 0 12px; color: #0f172a; font-size: 14px; }
    .message-box p { margin: 0; color: #334155; line-height: 1.6; white-space: pre-wrap; }
    .footer { background: #f8fafc; padding: 24px; text-align: center; color: #64748b; font-size: 12px; }
    .badge { display: inline-block; background: #f59e0b; color: #0f172a; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📦 Global Embrace</h1>
      <p>New Contact Form Submission</p>
    </div>
    <div class="content">
      <span class="badge">${data.subject}</span>
      
      <div class="field">
        <div class="field-label">From</div>
        <div class="field-value">${data.name}</div>
      </div>
      
      <div class="field">
        <div class="field-label">Email</div>
        <div class="field-value">${data.email}</div>
      </div>
      
      ${data.phone ? `
      <div class="field">
        <div class="field-label">Phone</div>
        <div class="field-value">${data.phone}</div>
      </div>
      ` : ''}
      
      ${data.company ? `
      <div class="field">
        <div class="field-label">Company</div>
        <div class="field-value">${data.company}</div>
      </div>
      ` : ''}
      
      <div class="message-box">
        <h3>Message</h3>
        <p>${data.message}</p>
      </div>
    </div>
    <div class="footer">
      This message was sent from the Global Embrace contact form.<br>
      Reply directly to this email to respond to the customer.
    </div>
  </div>
</body>
</html>
`;

const getAutoReplyEmail = (name: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px; text-align: center; }
    .header h1 { color: #f59e0b; margin: 0; font-size: 28px; }
    .content { padding: 32px; }
    .content h2 { color: #0f172a; margin: 0 0 16px; }
    .content p { color: #64748b; line-height: 1.6; margin: 0 0 16px; }
    .highlight { background: #fffbeb; border-radius: 8px; padding: 20px; margin: 24px 0; border: 1px solid #fde68a; }
    .highlight p { margin: 0; color: #92400e; }
    .contact-info { background: #f8fafc; border-radius: 8px; padding: 20px; }
    .contact-info h3 { margin: 0 0 12px; color: #0f172a; font-size: 14px; }
    .contact-info p { margin: 4px 0; color: #64748b; font-size: 14px; }
    .footer { background: #f8fafc; padding: 24px; text-align: center; color: #64748b; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📦 Global Embrace</h1>
    </div>
    <div class="content">
      <h2>Thank you for contacting us, ${name}!</h2>
      <p>We've received your message and our team will get back to you within 24 hours.</p>
      
      <div class="highlight">
        <p>⏰ Our typical response time is within 4-8 business hours.</p>
      </div>
      
      <p>In the meantime, you can:</p>
      <ul style="color: #64748b; line-height: 1.8;">
        <li>Track your shipment on our <a href="#" style="color: #f59e0b;">Track page</a></li>
        <li>Browse our <a href="#" style="color: #f59e0b;">FAQ section</a> for quick answers</li>
        <li>Get an instant quote on our <a href="#" style="color: #f59e0b;">Services page</a></li>
      </ul>
      
      <div class="contact-info">
        <h3>Need Urgent Assistance?</h3>
        <p>📞 Call us: 1-800-EMBRACE</p>
        <p>💬 Live chat: Available 24/7 on our website</p>
      </div>
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} Global Embrace. All rights reserved.<br>
      This is an automated response. Please do not reply to this email.
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
    const data: ContactFormRequest = await req.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.subject || !data.message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing contact form from ${data.name} (${data.email})`);

    const subjectMap: Record<string, string> = {
      shipping: "Shipping Inquiry",
      tracking: "Tracking Issue",
      quote: "Quote Request",
      partnership: "Business Partnership",
      complaint: "Complaint",
      other: "General Inquiry",
    };

    const subjectText = subjectMap[data.subject] || data.subject;

    // Send notification to support team
    const notificationRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Global Embrace Contact Form <onboarding@resend.dev>",
        to: ["delivered@resend.dev"], // In production, replace with actual support email
        reply_to: data.email,
        subject: `[${subjectText}] Contact from ${data.name}`,
        html: getContactFormEmail({ ...data, subject: subjectText }),
      }),
    });

    if (!notificationRes.ok) {
      const errorData = await notificationRes.text();
      console.error("Resend notification error:", errorData);
      throw new Error(`Failed to send notification: ${notificationRes.status}`);
    }

    console.log("Notification email sent to support team");

    // Send auto-reply to customer
    const autoReplyRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Global Embrace <onboarding@resend.dev>",
        to: [data.email],
        subject: "We've received your message - Global Embrace",
        html: getAutoReplyEmail(data.name),
      }),
    });

    if (!autoReplyRes.ok) {
      const errorData = await autoReplyRes.text();
      console.error("Resend auto-reply error:", errorData);
      // Don't throw here - notification was sent successfully
    } else {
      console.log(`Auto-reply sent to ${data.email}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Message sent successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error processing contact form:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
