import { Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { DashboardStats } from './dashboard.dto';
import { SubmissionStatus } from '../generated/prisma/enums';

@Resolver()
export class DashboardResolver {
  constructor(private readonly prisma: PrismaService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => DashboardStats)
  async dashboardStats() {
    const [newContacts, newVolunteers, newSubscribers, causes, galleryItems, newsArticles] = await Promise.all([
      this.prisma.contactSubmission.count({ where: { status: SubmissionStatus.NEW } }),
      this.prisma.volunteerSubmission.count({ where: { status: SubmissionStatus.NEW } }),
      this.prisma.newsletterSubscriber.count({ where: { status: SubmissionStatus.NEW } }),
      this.prisma.cause.count(),
      this.prisma.galleryItem.count(),
      this.prisma.newsArticle.count(),
    ]);
    return { newContacts, newVolunteers, newSubscribers, causes, galleryItems, newsArticles };
  }
}
