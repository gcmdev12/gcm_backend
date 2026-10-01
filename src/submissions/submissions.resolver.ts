import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard';
import { ContactSubmissionInput, NewsletterInput, SubmissionStatusInput, SubmissionSummary, VolunteerSubmissionInput, SponsorSubmissionInput } from './submissions.dto';
import { SubmissionsService } from './submissions.service';
import { SubmissionStatus } from '../generated/prisma/enums';

@Resolver()
export class SubmissionsResolver {
  constructor(private readonly service: SubmissionsService) {}

  @Mutation(() => Boolean)
  async submitContactForm(@Args('input') input: ContactSubmissionInput) { await this.service.createContact(input); return true; }
  @Mutation(() => Boolean)
  async submitVolunteerForm(@Args('input') input: VolunteerSubmissionInput) { await this.service.createVolunteer(input); return true; }
  @Mutation(() => Boolean)
  async submitSponsorForm(@Args('input') input: SponsorSubmissionInput) { await this.service.createSponsor(input); return true; }
  @Mutation(() => Boolean)
  async subscribeNewsletter(@Args('input') input: NewsletterInput) { await this.service.subscribe(input); return true; }

  @UseGuards(GqlAuthGuard)
  @Query(() => [String])
  async adminNotificationTypes() { return ['CONTACT', 'VOLUNTEER', 'NEWSLETTER', 'SPONSOR']; }

  @UseGuards(GqlAuthGuard)
  @Query(() => SubmissionSummary)
  submissionSummary() { return this.service.summary(); }

  @UseGuards(GqlAuthGuard)
  @Query(() => [ContactSubmissionGraph])
  contactSubmissions(@Args('status', { type: () => SubmissionStatus, nullable: true }) status?: SubmissionStatus) { return this.service.listContacts(status); }

  @UseGuards(GqlAuthGuard)
  @Query(() => [VolunteerSubmissionGraph])
  volunteerSubmissions(@Args('status', { type: () => SubmissionStatus, nullable: true }) status?: SubmissionStatus) { return this.service.listVolunteers(status); }

  @UseGuards(GqlAuthGuard)
  @Query(() => [SponsorSubmissionGraph])
  sponsorSubmissions(@Args('status', { type: () => SubmissionStatus, nullable: true }) status?: SubmissionStatus) { return this.service.listSponsors(status); }

  @UseGuards(GqlAuthGuard)
  @Query(() => [NewsletterSubscriberGraph])
  newsletterSubscribers(@Args('status', { type: () => SubmissionStatus, nullable: true }) status?: SubmissionStatus) { return this.service.listSubscribers(status); }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ContactSubmissionGraph)
  updateContactSubmissionStatus(@Args('id') id: string, @Args('input') input: SubmissionStatusInput) { return this.service.updateContactStatus(id, input.status); }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => VolunteerSubmissionGraph)
  updateVolunteerSubmissionStatus(@Args('id') id: string, @Args('input') input: SubmissionStatusInput) { return this.service.updateVolunteerStatus(id, input.status); }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => SponsorSubmissionGraph)
  updateSponsorSubmissionStatus(@Args('id') id: string, @Args('input') input: SubmissionStatusInput) { return this.service.updateSponsorStatus(id, input.status); }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => NewsletterSubscriberGraph)
  updateNewsletterSubscriberStatus(@Args('id') id: string, @Args('input') input: SubmissionStatusInput) { return this.service.updateSubscriberStatus(id, input.status); }
}

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
class ContactSubmissionGraph { @Field() id!: string; @Field() name!: string; @Field() email!: string; @Field({ nullable: true }) phone?: string; @Field({ nullable: true }) subject?: string; @Field() message!: string; @Field(() => SubmissionStatus) status!: SubmissionStatus; @Field() createdAt!: Date; }
@ObjectType()
class VolunteerSubmissionGraph { @Field() id!: string; @Field() name!: string; @Field() email!: string; @Field({ nullable: true }) phone?: string; @Field({ nullable: true }) location?: string; @Field({ nullable: true }) interests?: string; @Field({ nullable: true }) availability?: string; @Field({ nullable: true }) experience?: string; @Field({ nullable: true }) message?: string; @Field(() => SubmissionStatus) status!: SubmissionStatus; @Field() createdAt!: Date; }
@ObjectType()
class NewsletterSubscriberGraph { @Field() id!: string; @Field() email!: string; @Field({ nullable: true }) name?: string; @Field(() => SubmissionStatus) status!: SubmissionStatus; @Field() subscribedAt!: Date; }
@ObjectType()
class SponsorSubmissionGraph { @Field() id!: string; @Field() name!: string; @Field() email!: string; @Field({ nullable: true }) phone?: string; @Field({ nullable: true }) location?: string; @Field({ nullable: true }) preferredContact?: string; @Field({ nullable: true }) message?: string; @Field(() => SubmissionStatus) status!: SubmissionStatus; @Field() createdAt!: Date; }
