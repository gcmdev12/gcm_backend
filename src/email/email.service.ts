import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { PrismaService } from '../prisma/prisma.service';

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char] ?? char);
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend?: Resend;

  constructor(private readonly prisma: PrismaService) {
    if (process.env.RESEND_API_KEY) this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async notify(type: string, subject: string, html: string, replyTo?: string) {
    const recipient = 'glorychildrenministries@gmail.com';
    const from = process.env.RESEND_FROM ?? 'Glory Children Ministry <notifications@glorychildrenministry.org>';

    if (!this.resend) {
      await this.prisma.emailNotificationLog.create({ data: { type, recipient, subject, status: 'SKIPPED', errorMessage: 'RESEND_API_KEY is not configured' } });
      this.logger.warn('Resend is not configured; notification was skipped.');
      return;
    }

    try {
      const result = await this.resend.emails.send({
        from,
        to: [recipient],
        subject,
        html,
        ...(replyTo ? { replyTo } : {}),
      });

      if (result.error) throw new Error(result.error.message);
      await this.prisma.emailNotificationLog.create({
        data: { type, recipient, subject, resendId: result.data?.id, status: 'SENT' },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown Resend error';
      await this.prisma.emailNotificationLog.create({
        data: { type, recipient, subject, status: 'FAILED', errorMessage: message },
      });
      this.logger.error(`Resend notification failed: ${message}`);
    }
  }

  /**
   * Send an acknowledgement to the person who submitted a form.
   * A missing email address is intentionally a no-op. Delivery errors are logged
   * but do not undo a successful form submission.
   */
  async confirmSubmission(type: string, recipient: string | undefined, subject: string, html: string) {
    const address = recipient?.trim();
    if (!address) return;

    const logType = `${type}_CONFIRMATION`;
    const from = process.env.RESEND_FROM ?? 'Glory Children Ministry <notifications@glorychildrenministry.org>';

    if (!this.resend) {
      await this.prisma.emailNotificationLog.create({
        data: { type: logType, recipient: address, subject, status: 'SKIPPED', errorMessage: 'RESEND_API_KEY is not configured' },
      });
      this.logger.warn(`Confirmation email for ${type} was skipped because Resend is not configured.`);
      return;
    }

    try {
      const result = await this.resend.emails.send({ from, to: [address], subject, html });
      if (result.error) throw new Error(result.error.message);
      await this.prisma.emailNotificationLog.create({
        data: { type: logType, recipient: address, subject, resendId: result.data?.id, status: 'SENT' },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown Resend error';
      try {
        await this.prisma.emailNotificationLog.create({
          data: { type: logType, recipient: address, subject, status: 'FAILED', errorMessage: message },
        });
      } catch (logError) {
        this.logger.error('Could not record confirmation email failure in the database.');
      }
      this.logger.error(`Confirmation email for ${type} failed: ${message}`);
    }
  }

  contactHtml(data: { name: string; email: string; phone?: string; subject?: string; message: string }) {
    return this.layout('New Contact Us Submission', [
      ['Name', data.name], ['Email', data.email], ['Phone', data.phone ?? 'Not provided'],
      ['Subject', data.subject ?? 'Not provided'], ['Message', data.message],
    ]);
  }

  volunteerHtml(data: { name: string; email: string; phone?: string; location?: string; interests?: string; availability?: string; experience?: string; message?: string }) {
    return this.layout('New Volunteer Application', [
      ['Name', data.name], ['Email', data.email], ['Phone', data.phone ?? 'Not provided'],
      ['Location', data.location ?? 'Not provided'], ['Interests', data.interests ?? 'Not provided'],
      ['Availability', data.availability ?? 'Not provided'], ['Experience', data.experience ?? 'Not provided'],
      ['Message', data.message ?? 'Not provided'],
    ]);
  }

  newsletterHtml(data: { email: string; name?: string }) {
    return this.layout('New Newsletter Subscriber', [['Name', data.name ?? 'Not provided'], ['Email', data.email]]);
  }

  sponsorHtml(data: { name: string; email: string; phone?: string; location?: string; preferredContact?: string; message?: string }) {
    return this.layout('New Sponsor a Child Enquiry', [
      ['Name', data.name],
      ['Email', data.email],
      ['Phone', data.phone ?? 'Not provided'],
      ['Location', data.location ?? 'Not provided'],
      ['Preferred contact', data.preferredContact ?? 'Not provided'],
      ['Message', data.message ?? 'Not provided'],
    ]);
  }

  private confirmationHtml(title: string, greeting: string, message: string) {
    return `<div style="font-family:Arial,sans-serif;color:#24113f;max-width:640px;margin:24px auto;padding:28px;border:1px solid #eee;border-radius:14px;line-height:1.65"><div style="font-size:13px;font-weight:700;letter-spacing:1px;color:#6f2dbd">GLORY CHILDREN MINISTRY</div><h2 style="color:#6f2dbd;margin-bottom:12px">${escapeHtml(title)}</h2><p>${escapeHtml(greeting)}</p><p>${escapeHtml(message)}</p><p>Thank you for being part of our mission to bring hope, education and opportunity to children.</p><p style="margin-top:28px;color:#666;font-size:13px">Hope. Education. Opportunity.<br/>Glory Children Ministry</p></div>`;
  }

  contactConfirmationHtml(name: string) {
    return this.confirmationHtml('We received your message', `Hello ${name},`, 'Thank you for contacting us. Your message has been received, and our team will review it and get back to you as soon as possible.');
  }

  volunteerConfirmationHtml(name: string) {
    return this.confirmationHtml('Thank you for volunteering', `Hello ${name},`, 'We have received your volunteer application. Our team will review the details and contact you about the next steps.');
  }

  sponsorConfirmationHtml(name: string) {
    return this.confirmationHtml('Thank you for your interest in child sponsorship', `Hello ${name},`, 'We have received your sponsorship enquiry. Our team will follow up with you to discuss how you can help support a child.');
  }

  newsletterConfirmationHtml(name?: string) {
    return this.confirmationHtml('You are subscribed!', name?.trim() ? `Hello ${name.trim()},` : 'Hello,', 'Thank you for subscribing to Glory Children Ministry updates. We look forward to sharing news, stories and updates about our work with children.');
  }

  private layout(title: string, rows: [string, string][]) {
    const body = rows.map(([label, value]) => `<tr><td style="padding:8px 12px;font-weight:700;vertical-align:top">${escapeHtml(label)}</td><td style="padding:8px 12px;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`).join('');
    return `<div style="font-family:Arial,sans-serif;color:#24113f;max-width:700px;margin:auto"><h2 style="color:#6f2dbd">${escapeHtml(title)}</h2><table style="width:100%;border-collapse:collapse;border:1px solid #eee">${body}</table><p style="margin-top:24px;color:#666">Glory Children Ministry website notification</p></div>`;
  }
}
