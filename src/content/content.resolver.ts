import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { GqlAuthGuard } from '../auth/auth.guard';

import {
  CauseGraph,
  CauseInput,
  GalleryGraph,
  GalleryItemInput,
  ImpactGraph,
  ImpactStatisticInput,
  MediaAssetInput,
  MediaGraph,
  NewsArticleInput,
  NewsGraph,
} from './content.dto';

import { ContentService } from './content.service';

@Resolver()
export class ContentResolver {
  constructor(private readonly service: ContentService) {}

  // =========================================================
  // PUBLIC QUERIES
  // =========================================================

  @Query(() => [CauseGraph])
  causes() {
    return this.service.causes();
  }

  @Query(() => [ImpactGraph])
  impactStatistics() {
    return this.service.impacts();
  }

  @Query(() => [MediaGraph])
  mediaAssets() {
    return this.service.media();
  }

  @Query(() => [GalleryGraph])
  galleryItems() {
    return this.service.gallery();
  }

  @Query(() => [NewsGraph])
  newsArticles() {
    return this.service.news();
  }

  // =========================================================
  // ADMIN QUERIES
  // =========================================================

  @UseGuards(GqlAuthGuard)
  @Query(() => [CauseGraph])
  adminCauses() {
    return this.service.allCauses();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [GalleryGraph])
  adminGalleryItems() {
    return this.service.allGallery();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [NewsGraph])
  adminNewsArticles() {
    return this.service.allNews();
  }

  // =========================================================
  // CAUSES
  // =========================================================

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CauseGraph)
  createCause(
    @Args('input', { type: () => CauseInput })
    input: CauseInput,
  ) {
    return this.service.createCause(input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CauseGraph)
  updateCause(
    @Args('id', { type: () => String })
    id: string,

    @Args('input', { type: () => CauseInput })
    input: CauseInput,
  ) {
    return this.service.updateCause(id, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CauseGraph)
  deleteCause(
    @Args('id', { type: () => String })
    id: string,
  ) {
    return this.service.deleteCause(id);
  }

  // =========================================================
  // IMPACT STATISTICS
  // =========================================================

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ImpactGraph)
  upsertImpactStatistic(
    @Args('id', {
      type: () => String,
      nullable: true,
    })
    id: string | undefined,

    @Args('input', {
      type: () => ImpactStatisticInput,
    })
    input: ImpactStatisticInput,
  ) {
    return this.service.upsertImpact(id, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ImpactGraph)
  deleteImpactStatistic(
    @Args('id', { type: () => String })
    id: string,
  ) {
    return this.service.deleteImpact(id);
  }

  // =========================================================
  // MEDIA ASSETS
  // =========================================================

  @UseGuards(GqlAuthGuard)
  @Mutation(() => MediaGraph)
  upsertMediaAsset(
    @Args('id', {
      type: () => String,
      nullable: true,
    })
    id: string | undefined,

    @Args('input', {
      type: () => MediaAssetInput,
    })
    input: MediaAssetInput,
  ) {
    return this.service.upsertMedia(id, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => MediaGraph)
  deleteMediaAsset(
    @Args('id', { type: () => String })
    id: string,
  ) {
    return this.service.deleteMedia(id);
  }

  // =========================================================
  // GALLERY
  // =========================================================

  @UseGuards(GqlAuthGuard)
  @Mutation(() => GalleryGraph)
  createGalleryItem(
    @Args('input', {
      type: () => GalleryItemInput,
    })
    input: GalleryItemInput,
  ) {
    return this.service.createGallery(input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => GalleryGraph)
  updateGalleryItem(
    @Args('id', { type: () => String })
    id: string,

    @Args('input', {
      type: () => GalleryItemInput,
    })
    input: GalleryItemInput,
  ) {
    return this.service.updateGallery(id, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => GalleryGraph)
  deleteGalleryItem(
    @Args('id', { type: () => String })
    id: string,
  ) {
    return this.service.deleteGallery(id);
  }

  // =========================================================
  // NEWS
  // =========================================================

  @UseGuards(GqlAuthGuard)
  @Mutation(() => NewsGraph)
  createNewsArticle(
    @Args('input', {
      type: () => NewsArticleInput,
    })
    input: NewsArticleInput,
  ) {
    return this.service.createNews(input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => NewsGraph)
  updateNewsArticle(
    @Args('id', { type: () => String })
    id: string,

    @Args('input', {
      type: () => NewsArticleInput,
    })
    input: NewsArticleInput,
  ) {
    return this.service.updateNews(id, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => NewsGraph)
  deleteNewsArticle(
    @Args('id', { type: () => String })
    id: string,
  ) {
    return this.service.deleteNews(id);
  }
}