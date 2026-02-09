import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof subject !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !subject.trim() ||
      !message.trim()
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const apiKey =
      process.env.SENDGRID_API_KEY ||
      process.env.SENDGRID_KEY ||
      process.env.SG_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "SendGrid not configured" }, { status: 500 });
    }

    const toEmail = "azursoldev@gmail.com";
    const fromEmail = process.env.SENDGRID_FROM || "support@likes.io";
    let sent = false;
    
    try {
      sgMail.setApiKey(apiKey);
      await sgMail.send({
        to: toEmail,
        from: fromEmail,
        replyTo: email,
        subject: `${subject} - Contact from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
        html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr />
          <p>${message.replace(/\n/g, "<br/>")}</p>
        </div>`,
      });
      sent = true;
    } catch (e) {
      // Fallback to SMTP (useful in environments where web API is blocked or vice versa)
      const transporter = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 587,
        secure: false,
        auth: { user: "apikey", pass: apiKey },
      });
      const res = await transporter.sendMail({
        from: `"Likes.io Support" <${fromEmail}>`,
        to: toEmail,
        replyTo: email,
        subject: `${subject} - Contact from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
        html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr />
          <p>${message.replace(/\n/g, "<br/>")}</p>
        </div>`,
      });
      sent = !!res.messageId;
    }

    if (!sent) {
      return NextResponse.json({ error: "Failed to send" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
