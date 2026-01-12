import nodemailer from 'nodemailer';
import { prisma } from './prisma';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  userId?: string;
  type?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  private async getBrandedHtml(content: string, settings: any): Promise<string> {
    const year = new Date().getFullYear();
    const logoUrl = settings?.headerLogoUrl || settings?.footerLogoUrl || '';
    const logoHtml = logoUrl 
      ? `<img src="${logoUrl}" alt="Likes.io" style="max-height: 40px; border: 0; outline: none; text-decoration: none;">` 
      : '<h2 style="color: #333; margin: 0;">Likes.io</h2>';

    return `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<style>
  img { max-width: 100%; }
  body { background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
  .body { background-color: #f6f6f6; width: 100%; }
  .container { display: block; margin: 0 auto !important; max-width: 580px; padding: 10px; width: 100%; box-sizing: border-box; }
  .content { box-sizing: border-box; display: block; margin: 0 auto; max-width: 580px; padding: 10px; width: 100%; }
  .main { background: #ffffff; border-radius: 3px; width: 100%; }
  .wrapper { box-sizing: border-box; padding: 20px; word-break: break-word; }
  .footer { clear: both; margin-top: 10px; text-align: center; width: 100%; }
  .footer td, .footer p, .footer span, .footer a { color: #999999; font-size: 12px; text-align: center; }
  h1, h2, h3, h4 { color: #000000; font-family: sans-serif; font-weight: 400; line-height: 1.4; margin: 0; margin-bottom: 30px; }
  p, ul, ol { font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; margin-bottom: 15px; }
  p li, ul li, ol li { list-style-position: inside; margin-left: 5px; }
  a { color: #3498db; text-decoration: underline; }

  /* Mobile Styles */
  @media only screen and (max-width: 620px) {
    .main { width: 100% !important; }
    .wrapper { padding: 15px !important; }
    .content { padding: 0 !important; }
    .container { padding: 0 !important; width: 100% !important; max-width: 100% !important; }
    h1 { font-size: 22px !important; margin-bottom: 20px !important; }
    p, ul, ol { font-size: 16px !important; }
    .btn-primary table { width: 100% !important; }
    .btn-primary a { width: 100% !important; box-sizing: border-box; text-align: center; }
  }
</style>
</head>
<body>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
    <tr>
      <td align="center">
        <div class="container">
          <div class="content">
            <!-- Header -->
            <div style="text-align: center; padding: 20px 0;">
              ${logoHtml}
            </div>
            
            <!-- Content -->
            <table role="presentation" class="main">
              <tr>
                <td class="wrapper">
                  ${content}
                </td>
              </tr>
            </table>

            <!-- Footer -->
            <div class="footer">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="content-block">
                    <span class="apple-link">© ${year} Likes.io. All rights reserved.</span>
                    <br>
                    <span>If you didn’t request this email, please ignore it or contact support.</span>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }

  private async getTransporter(): Promise<nodemailer.Transporter> {
    // Always fetch latest settings to ensure we use current config
    // We can cache the transporter if settings haven't changed, but for now let's recreate if needed
    // or just rely on instance caching.
    // If we want to support dynamic updates without restart, we should probably not cache 'transporter' indefinitely
    // or check if config changed.
    // For simplicity, let's keep caching but assume this service might be short-lived (serverless)
    // or acceptable to require restart/re-instantiation.
    
    if (this.transporter) {
      return this.transporter;
    }

    const settings = await prisma.adminSettings.findFirst();

    const smtpHost = settings?.smtpHost || process.env.SMTP_HOST;
    const smtpUser = settings?.smtpUser || process.env.SMTP_USER;
    const smtpPass = settings?.smtpPass || process.env.SMTP_PASS;
    const smtpPort = settings?.smtpPort || parseInt(process.env.SMTP_PORT || '587');
    const smtpSecure = settings?.smtpSecure ?? (process.env.SMTP_SECURE === 'true');

    if (!smtpHost || !smtpUser || !smtpPass) {
      throw new Error('SMTP configuration is missing');
    }

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    return this.transporter;
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const transporter = await this.getTransporter();
      
      const settings = await prisma.adminSettings.findFirst();
      const from = settings?.smtpFrom || process.env.SMTP_FROM || settings?.smtpUser || process.env.SMTP_USER;

      // Apply branding
      const brandedHtml = await this.getBrandedHtml(options.html, settings);

      const result = await transporter.sendMail({
        from: from,
        to: options.to,
        subject: options.subject,
        html: brandedHtml,
        text: options.text || options.html.replace(/<[^>]*>/g, ''),
      });

      console.log(`Email sent to ${options.to}`);

      // Log success
      try {
        await prisma.emailLog.create({
          data: {
            userId: options.userId,
            type: options.type || 'other',
            status: 'sent',
            providerMessageId: result.messageId,
            metadata: {
              to: options.to,
              subject: options.subject
            }
          }
        });
      } catch (logError) {
        console.error('Failed to log email success:', logError);
      }

    } catch (error: any) {
      console.error('Email send error:', error);

      // Log failure
      try {
        await prisma.emailLog.create({
          data: {
            userId: options.userId,
            type: options.type || 'other',
            status: 'failed',
            metadata: {
              to: options.to,
              subject: options.subject,
              error: error.message
            }
          }
        });
      } catch (logError) {
        console.error('Failed to log email error:', logError);
      }

      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async sendWelcomeEmail(email: string, name?: string): Promise<void> {
    const subject = 'Welcome to Likes.io — You’re all set ✅';
    const dashboardUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard`;
    const supportUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/support`;

    const html = `
      <h1>Welcome to Likes.io${name ? `, ${name}` : ''}</h1>
      <p>Your account has been created successfully.</p>
      <p>We're excited to have you on board. You can now access your dashboard to view your orders and manage your account.</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${dashboardUrl}" style="background-color: #3498db; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; display: inline-block;">Go to your dashboard</a>
      </p>
      <p>Need help? <a href="${supportUrl}">Contact support</a></p>
    `;

    await this.sendEmail({
      to: email,
      subject,
      html,
      type: 'welcome',
    });
  }

  async sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
    const subject = 'Reset your Likes.io password';
    
    const html = `
      <h1>Reset your Likes.io password</h1>
      <p>We received a request to reset your password.</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #3498db; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset password</a>
      </p>
      <p>This link expires in 60 minutes.</p>
      <p>If you didn’t request this, you can ignore this email.</p>
    `;

    await this.sendEmail({
      to: email,
      subject,
      html,
      type: 'password_reset',
    });
  }

  async sendOrderConfirmation(orderId: string): Promise<void> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        service: true,
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Try to get email template from CMS
    let template = await prisma.emailTemplate.findFirst({
      where: {
        type: 'order_confirmation',
        isActive: true,
      },
    });

    const subject = template?.subject || `Order Confirmation - ${orderId}`;
    let html = template?.body || '';

    // Replace template variables
    html = html
      .replace(/\{\{orderId\}\}/g, order.id)
      .replace(/\{\{serviceName\}\}/g, order.service.name)
      .replace(/\{\{platform\}\}/g, order.platform)
      .replace(/\{\{serviceType\}\}/g, order.serviceType)
      .replace(/\{\{quantity\}\}/g, order.quantity.toString())
      .replace(/\{\{price\}\}/g, `$${order.price.toFixed(2)}`)
      .replace(/\{\{currency\}\}/g, order.currency);

    // If no template, use default
    if (!template) {
      html = `
        <h1>Order Confirmation</h1>
        <p>Thank you for your order!</p>
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Service:</strong> ${order.service.name}</p>
        <p><strong>Platform:</strong> ${order.platform}</p>
        <p><strong>Quantity:</strong> ${order.quantity}</p>
        <p><strong>Total:</strong> $${order.price.toFixed(2)} ${order.currency}</p>
        <p>Your order is being processed and will be delivered soon.</p>
      `;
    }

    await this.sendEmail({
      to: order.user.email,
      subject,
      html,
      userId: order.userId,
      type: 'order_confirmation',
    });
  }

  async sendPaymentSuccess(orderId: string): Promise<void> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        service: true,
        payment: true,
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    // Mask payment method if possible, otherwise generic
    const paymentMethod = order.payment && Array.isArray(order.payment) && order.payment.length > 0
      ? order.payment[0].gateway
      : 'Payment Gateway';
    const maskedPaymentMethod = paymentMethod.replace(/_/g, ' '); // Simple formatting
    
    // Mask target link/username for privacy
    const target = order.link || '';
    const maskedTarget = target && target.length > 20 ? target.substring(0, 15) + '...' : target;

    const subject = `Order Confirmed — ${order.id} (Likes.io)`;
    const dashboardUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard/orders`;
    
    // Date formatting
    const date = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const html = `
      <h1>✅ Order Confirmed</h1>
      <p>We’ve received your order and it’s now being processed.</p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h2 style="margin-top: 0; color: #333;">Order ID: ${order.id}</h2>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Date:</strong> ${date}</p>
        
        <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
        
        <h3 style="margin-bottom: 10px;">Details</h3>
        <p><strong>Service:</strong> ${order.service.name}</p>
        <p><strong>Package:</strong> ${order.serviceType} - ${order.quantity}</p>
        <p><strong>Target:</strong> ${maskedTarget}</p>
        <p><strong>Total:</strong> ${order.price.toFixed(2)} ${order.currency}</p>
        <p><strong>Paid with:</strong> ${maskedPaymentMethod}</p>
      </div>

      <p style="text-align: center; margin: 30px 0;">
        <a href="${dashboardUrl}" style="background-color: #3498db; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; display: inline-block;">View your order</a>
      </p>
    `;

    await this.sendEmail({
      to: order.user.email,
      subject,
      html,
      userId: order.userId,
      type: 'order_confirmation', // Changed type to match semantic meaning
    });
  }

  async sendPaymentFailure(orderId: string): Promise<void> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        service: true,
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    let template = await prisma.emailTemplate.findFirst({
      where: {
        type: 'payment_failure',
        isActive: true,
      },
    });

    const subject = template?.subject || `Payment Failed - Order ${orderId}`;
    let html = template?.body || '';

    html = html.replace(/\{\{orderId\}\}/g, order.id);

    if (!template) {
      html = `
        <h1>Payment Failed</h1>
        <p>Unfortunately, your payment for order ${order.id} could not be processed.</p>
        <p>Please try again or contact support if the issue persists.</p>
      `;
    }

    await this.sendEmail({
      to: order.user.email,
      subject,
      html,
      userId: order.userId,
      type: 'payment_failure',
    });
  }

  async sendOrderCompletion(orderId: string): Promise<void> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        service: true,
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    let template = await prisma.emailTemplate.findFirst({
      where: {
        type: 'order_completion',
        isActive: true,
      },
    });

    const subject = template?.subject || `Order Completed - ${orderId}`;
    let html = template?.body || '';

    html = html
      .replace(/\{\{orderId\}\}/g, order.id)
      .replace(/\{\{serviceName\}\}/g, order.service.name)
      .replace(/\{\{quantity\}\}/g, order.quantity.toString());

    if (!template) {
      html = `
        <h1>Order Completed</h1>
        <p>Your order ${order.id} has been completed successfully!</p>
        <p><strong>Service:</strong> ${order.service.name}</p>
        <p><strong>Quantity:</strong> ${order.quantity}</p>
        <p>Thank you for using our service!</p>
      `;
    }

    await this.sendEmail({
      to: order.user.email,
      subject,
      html,
      userId: order.userId,
      type: 'order_completion',
    });
  }
}

export const emailService = new EmailService();

