import { BadRequestException, Injectable } from '@nestjs/common';
import { GalleryCategory } from '../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import { CauseInput, GalleryItemInput, ImpactStatisticInput, MediaAssetInput, NewsArticleInput } from './content.dto';

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  causes() { return this.prisma.cause.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }); }
  allCauses() { return this.prisma.cause.findMany({ orderBy: { sortOrder: 'asc' } }); }
  createCause(input: CauseInput) { return this.prisma.cause.create({ data: input }); }
  updateCause(id: string, input: CauseInput) { return this.prisma.cause.update({ where: { id }, data: input }); }
  updateCauseImage(id: string, imageUrl: string) { return this.prisma.cause.update({ where: { id }, data: { imageUrl } }); }
  deleteCause(id: string) { return this.prisma.cause.delete({ where: { id } }); }

  impacts() { return this.prisma.impactStatistic.findMany({ orderBy: { sortOrder: 'asc' } }); }
  upsertImpact(id: string | undefined, input: ImpactStatisticInput) {
    if (id) return this.prisma.impactStatistic.update({ where: { id }, data: input });
    return this.prisma.impactStatistic.create({ data: input });
  }
  deleteImpact(id: string) { return this.prisma.impactStatistic.delete({ where: { id } }); }

  media() { return this.prisma.mediaAsset.findMany({ orderBy: { page: 'asc' } }); }
  upsertMedia(id: string | undefined, input: MediaAssetInput) {
    if (id) return this.prisma.mediaAsset.update({ where: { id }, data: input });
    return this.prisma.mediaAsset.create({ data: input });
  }
  deleteMedia(id: string) { return this.prisma.mediaAsset.delete({ where: { id } }); }

  gallery() { return this.prisma.galleryItem.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } }); }
  allGallery() { return this.prisma.galleryItem.findMany({ orderBy: { sortOrder: 'asc' } }); }
  createGallery(input: GalleryItemInput) {
    const category = this.normalizeGalleryCategory(input.category);
    return this.prisma.galleryItem.create({ data: { ...input, category } });
  }

  updateGallery(id: string, input: GalleryItemInput) {
    const category = this.normalizeGalleryCategory(input.category);
    return this.prisma.galleryItem.update({ where: { id }, data: { ...input, category } });
  }

  private normalizeGalleryCategory(value: string) {
    const category = value.trim().toUpperCase() as GalleryCategory;
    const allowed = new Set([
      'DAILY_LIFE_GROWTH',
      'COMMUNITY_FELLOWSHIP',
      'LEARNING_CREATIVITY',
      'EVENTS_MILESTONES',
      'OTHERS',
      'EDUCATION',
      'HEALTH',
      'FOOD',
      'GUIDANCE',
      'SHELTER',
      'SKILLS',
      'EVENTS',
      'OTHER',
    ]);

    if (!allowed.has(category)) {
      throw new BadRequestException(
        'Invalid gallery category. Please select a valid gallery category and try again.',
      );
    }

    return category;
  }
  deleteGallery(id: string) { return this.prisma.galleryItem.delete({ where: { id } }); }

  news() { return this.prisma.newsArticle.findMany({ where: { published: true }, orderBy: { publishedAt: 'desc' } }); }
  allNews() { return this.prisma.newsArticle.findMany({ orderBy: { createdAt: 'desc' } }); }
  createNews(input: NewsArticleInput) { return this.prisma.newsArticle.create({ data: { ...input, category: input.category?.trim() || 'PROGRAMME UPDATE', publishedAt: input.published ? new Date() : null } }); }
  updateNews(id: string, input: NewsArticleInput) { return this.prisma.newsArticle.update({ where: { id }, data: { ...input, category: input.category?.trim() || 'PROGRAMME UPDATE', publishedAt: input.published ? new Date() : null } }); }
  deleteNews(id: string) { return this.prisma.newsArticle.delete({ where: { id } }); }
}
