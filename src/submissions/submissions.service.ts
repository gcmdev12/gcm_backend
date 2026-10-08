import { Injectable } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../prisma/prisma.service';
import { ContactSubmissionInput, NewsletterInput, VolunteerSubmissionInput, SponsorSubmissionInput } from './submissions.dto';
import { SubmissionStatus } from '../generated/prisma/enums';

@Injectable()
export class SubmissionsService {
  constructor(private readonly prisma: PrismaService, private readonly email: EmailService) {}

  async createContact(input: ContactSubmissionInput) {
    const record = await this.prisma.contactSubmission.create({ data: input });
    await this.email.notify('CONTACT', `New Contact Submission: ${input.subject || input.name}`, this.email.contactHtml(input), input.email);
    await this.email.confirmSubmission('CONTACT', input.email, 'We received your message | Glory Children Ministry', this.email.contactConfirmationHtml(input.name));
    return record;
  }

  async createVolunteer(input: VolunteerSubmissionInput) {
    const record = await this.prisma.volunteerSubmission.create({ data: input });
    await this.email.notify('VOLUNTEER', `New Volunteer Application: ${input.name}`, this.email.volunteerHtml(input), input.email);
    await this.email.confirmSubmission('VOLUNTEER', input.email, 'Thank you for volunteering | Glory Children Ministry', this.email.volunteerConfirmationHtml(input.name));
    return record;
  }

  async createSponsor(input: SponsorSubmissionInput) {
    const record = await this.prisma.sponsorSubmission.create({ data: input });
    await this.email.notify('SPONSOR', `New Sponsor a Child Enquiry: ${input.name}`, this.email.sponsorHtml(input), input.email);
    await this.email.confirmSubmission('SPONSOR', input.email, 'We received your sponsorship enquiry | Glory Children Ministry', this.email.sponsorConfirmationHtml(input.name));
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
    await this.email.confirmSubmission('NEWSLETTER', email, 'You are subscribed | Glory Children Ministry', this.email.newsletterConfirmationHtml(input.name));
    return record;
  }

  listContacts(status?: SubmissionStatus) { return this.prisma.contactSubmission.findMany({ where: status ? { status } : undefined, orderBy: { createdAt: 'desc' } }); }
  listVolunteers(status?: SubmissionStatus) { return this.prisma.volunteerSubmission.findMany({ where: status ? { status } : undefined, orderBy: { createdAt: 'desc' } }); }
  listSponsors(status?: SubmissionStatus) { return this.prisma.sponsorSubmission.findMany({ where: status ? { status } : undefined, orderBy: { createdAt: 'desc' } }); }
  listSubscribers(status?: SubmissionStatus) { return this.prisma.newsletterSubscriber.findMany({ where: status ? { status } : undefined, orderBy: { subscribedAt: 'desc' } }); }

  updateContactStatus(id: string, status: SubmissionStatus) { return this.prisma.contactSubmission.update({ where: { id }, data: { status } }); }
  updateVolunteerStatus(id: string, status: SubmissionStatus) { return this.prisma.volunteerSubmission.update({ where: { id }, data: { status } }); }
  updateSponsorStatus(id: string, status: SubmissionStatus) { return this.prisma.sponsorSubmission.update({ where: { id }, data: { status } }); }
  updateSubscriberStatus(id: string, status: SubmissionStatus) { return this.prisma.newsletterSubscriber.update({ where: { id }, data: { status } }); }

  async summary() {
    const [contacts, volunteers, subscribers] = await Promise.all([
      this.prisma.contactSubmission.count({ where: { status: SubmissionStatus.NEW } }),
      this.prisma.volunteerSubmission.count({ where: { status: SubmissionStatus.NEW } }),
      this.prisma.newsletterSubscriber.count({ where: { status: SubmissionStatus.NEW } }),
    ]);
    const sponsors = await this.prisma.sponsorSubmission.count({ where: { status: SubmissionStatus.NEW } });
    return { contacts, volunteers, subscribers, sponsors };
  }
}
