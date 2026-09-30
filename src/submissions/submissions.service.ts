import { Injectable } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { ContactSubmissionInput, NewsletterInput, VolunteerSubmissionInput } from './submissions.dto';
import { SubmissionStatus } from '../generated/prisma/enums';

@Injectable()
export class SubmissionsService {
  constructor(private readonly prisma: PrismaService, private readonly email: EmailService) {}

  async createContact(input: ContactSubmissionInput) {
    const record = await this.prisma.contactSubmission.create({ data: input });
    await this.email.notify('CONTACT', `New Contact Submission: ${input.subject || input.name}`, this.email.contactHtml(input), input.email);
    return record;
  }

  async createVolunteer(input: VolunteerSubmissionInput) {
    const record = await this.prisma.volunteerSubmission.create({ data: input });
    await this.email.notify('VOLUNTEER', `New Volunteer Application: ${input.name}`, this.email.volunteerHtml(input), input.email);
    return record;
  }

  async subscribe(input: NewsletterInput) {
    const email = input.email.toLowerCase();
    const record = await this.prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { name: input.name, status: SubmissionStatus.NEW },
      create: { email, name: input.name },
    });
    await this.email.notify('NEWSLETTER', `New Newsletter Subscriber: ${email}`, this.email.newsletterHtml({ ...input, email }), email);
    return record;
  }

  listContacts(status?: SubmissionStatus) { return this.prisma.contactSubmission.findMany({ where: status ? { status } : undefined, orderBy: { createdAt: 'desc' } }); }
  listVolunteers(status?: SubmissionStatus) { return this.prisma.volunteerSubmission.findMany({ where: status ? { status } : undefined, orderBy: { createdAt: 'desc' } }); }
  listSubscribers(status?: SubmissionStatus) { return this.prisma.newsletterSubscriber.findMany({ where: status ? { status } : undefined, orderBy: { subscribedAt: 'desc' } }); }

  updateContactStatus(id: string, status: SubmissionStatus) { return this.prisma.contactSubmission.update({ where: { id }, data: { status } }); }
  updateVolunteerStatus(id: string, status: SubmissionStatus) { return this.prisma.volunteerSubmission.update({ where: { id }, data: { status } }); }
  updateSubscriberStatus(id: string, status: SubmissionStatus) { return this.prisma.newsletterSubscriber.update({ where: { id }, data: { status } }); }

  async summary() {
    const [contacts, volunteers, subscribers] = await Promise.all([
      this.prisma.contactSubmission.count({ where: { status: SubmissionStatus.NEW } }),
      this.prisma.volunteerSubmission.count({ where: { status: SubmissionStatus.NEW } }),
      this.prisma.newsletterSubscriber.count({ where: { status: SubmissionStatus.NEW } }),
    ]);
    return { contacts, volunteers, subscribers };
  }
}
