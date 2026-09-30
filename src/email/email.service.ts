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
    const recipient = 'gcmdev12@gmail.com';
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

  private layout(title: string, rows: [string, string][]) {
    const body = rows.map(([label, value]) => `<tr><td style="padding:8px 12px;font-weight:700;vertical-align:top">${escapeHtml(label)}</td><td style="padding:8px 12px;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`).join('');
    return `<div style="font-family:Arial,sans-serif;color:#24113f;max-width:700px;margin:auto"><h2 style="color:#6f2dbd">${escapeHtml(title)}</h2><table style="width:100%;border-collapse:collapse;border:1px solid #eee">${body}</table><p style="margin-top:24px;color:#666">Glory Children Ministry website notification</p></div>`;
  }
}
