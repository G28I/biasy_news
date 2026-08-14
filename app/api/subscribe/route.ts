import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
 
export async function POST(req: NextRequest) {
  try {
    const { email, action } = await req.json();
 
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }
 
    if (action !== "subscribe" && action !== "unsubscribe") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
 
    let smtpHost = process.env.SMTP_HOST;
    let smtpPort = parseInt(process.env.SMTP_PORT || "587");
    let smtpUser = process.env.SMTP_USER;
    let smtpPass = process.env.SMTP_PASS;
    let previewUrl = "";
 
    // If SMTP variables are missing, create an Ethereal SMTP test account dynamically
    if (!smtpHost || !smtpUser || !smtpPass) {
      console.log("No SMTP credentials found in environment. Generating dynamic Ethereal test account...");
      const testAccount = await nodemailer.createTestAccount();
      smtpHost = testAccount.smtp.host;
      smtpPort = testAccount.smtp.port;
      smtpUser = testAccount.user;
      smtpPass = testAccount.pass;
    }
 
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
 
    const isSub = action === "subscribe";
    const subject = isSub ? "Welcome to biasly news!" : "Unsubscribed from biasly news";
    
    const htmlContent = isSub ? `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; color: #1e293b;">
        <div style="display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 24px;">
          <span style="font-size: 24px; font-weight: 800; color: #0f172a;">biasly</span>
          <span style="background-color: #0f172a; color: #ffffff; font-size: 10px; font-weight: 900; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; letter-spacing: 0.05em;">News</span>
        </div>
        <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0;">Stay Informed. Stay Balanced.</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          Thank you for subscribing to biasly. You will now receive daily news updates and political framing breakdowns directly to your inbox.
        </p>
        <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 6px; padding: 16px; margin: 24px 0;">
          <h4 style="font-size: 13px; font-weight: 700; color: #0f172a; margin: 0 0 8px 0;">What you get:</h4>
          <ul style="font-size: 13px; line-height: 1.5; color: #475569; padding-left: 20px; margin: 0;">
            <li style="margin-bottom: 6px;">Daily balanced summaries of major stories.</li>
            <li style="margin-bottom: 6px;">AI-estimated political bias metrics (Left / Center / Right ratio).</li>
            <li style="margin-bottom: 6px;">Unveiled media framing notes and loaded terms detection.</li>
          </ul>
        </div>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          We believe in presenting facts and framing transparently so you can form your own conclusions.
        </p>
        <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 24px; font-size: 11px; color: #94a3b8; text-align: center;">
          <p style="margin: 0 0 4px 0;">Anytime unsubscribe, no questions asked.</p>
          <p style="margin: 0;">&copy; 2026 biasly News. All rights reserved.</p>
        </div>
      </div>
    ` : `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; color: #1e293b;">
        <div style="display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 24px;">
          <span style="font-size: 24px; font-weight: 800; color: #0f172a;">biasly</span>
          <span style="background-color: #0f172a; color: #ffffff; font-size: 10px; font-weight: 900; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; letter-spacing: 0.05em;">News</span>
        </div>
        <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 0;">Subscription Cancelled</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          You have successfully unsubscribed from the biasly daily newsletter. You will no longer receive daily news analyses.
        </p>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          If you did this by mistake, you can resubscribe anytime on the homepage.
        </p>
        <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 24px; font-size: 11px; color: #94a3b8; text-align: center;">
          <p style="margin: 0;">&copy; 2026 biasly News. All rights reserved.</p>
        </div>
      </div>
    `;
 
    const info = await transporter.sendMail({
      from: '"biasly News" <newsletter@biasly.news>',
      to: email,
      subject,
      html: htmlContent,
    });
 
    if (smtpHost.includes("ethereal")) {
      previewUrl = nodemailer.getTestMessageUrl(info) || "";
      console.log("====================================================");
      console.log(`[SMTP] Confirmation email sent to ${email}`);
      console.log(`[SMTP] Action: ${action.toUpperCase()}`);
      console.log(`[SMTP] Ethereal Preview URL: ${previewUrl}`);
      console.log("====================================================");
    } else {
      console.log(`[SMTP] Confirmation email sent to ${email} via ${smtpHost}`);
    }
 
    return NextResponse.json({
      success: true,
      action,
      email,
      previewUrl,
    });
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("API subscribe route error:", errMsg);
    return NextResponse.json({ error: `Subscription failed: ${errMsg}` }, { status: 500 });
  }
}
