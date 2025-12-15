import nodemailer from 'nodemailer';
import { prisma } from './prisma';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  private async getTransporter(): Promise<nodemailer.Transporter> {
    if (this.transporter) {
      return this.transporter;
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpUser || !smtpPass) {
      throw new Error('SMTP configuration is missing');
    }

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
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
      
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || options.html.replace(/<[^>]*>/g, ''),
      });

      console.log(`Email sent to ${options.to}`);
    } catch (error: any) {
      console.error('Email send error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }
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

    let template = await prisma.emailTemplate.findFirst({
      where: {
        type: 'payment_success',
        isActive: true,
      },
    });

    const subject = template?.subject || `Payment Successful - Order ${orderId}`;
    let html = template?.body || '';

    html = html
      .replace(/\{\{orderId\}\}/g, order.id)
      .replace(/\{\{amount\}\}/g, `$${order.price.toFixed(2)}`)
      .replace(/\{\{currency\}\}/g, order.currency);

    if (!template) {
      html = `
        <h1>Payment Successful</h1>
        <p>Your payment for order ${order.id} has been processed successfully.</p>
        <p><strong>Amount:</strong> $${order.price.toFixed(2)} ${order.currency}</p>
        <p>Your order is now being processed.</p>
      `;
    }

    await this.sendEmail({
      to: order.user.email,
      subject,
      html,
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
    });
  }
}

export const emailService = new EmailService();

