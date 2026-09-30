import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard';
import { CauseGraph, CauseInput, GalleryGraph, GalleryItemInput, ImpactGraph, ImpactStatisticInput, MediaAssetInput, MediaGraph, NewsArticleInput, NewsGraph } from './content.dto';
import { ContentService } from './content.service';

@Resolver()
export class ContentResolver {
  constructor(private readonly service: ContentService) {}

  @Query(() => [CauseGraph]) causes() { return this.service.causes(); }
  @Query(() => [ImpactGraph]) impactStatistics() { return this.service.impacts(); }
  @Query(() => [MediaGraph]) mediaAssets() { return this.service.media(); }
  @Query(() => [GalleryGraph]) galleryItems() { return this.service.gallery(); }
  @Query(() => [NewsGraph]) newsArticles() { return this.service.news(); }

  @UseGuards(GqlAuthGuard) @Query(() => [CauseGraph]) adminCauses() { return this.service.allCauses(); }
  @UseGuards(GqlAuthGuard) @Query(() => [GalleryGraph]) adminGalleryItems() { return this.service.allGallery(); }
  @UseGuards(GqlAuthGuard) @Query(() => [NewsGraph]) adminNewsArticles() { return this.service.allNews(); }

  @UseGuards(GqlAuthGuard) @Mutation(() => CauseGraph) createCause(@Args('input') input: CauseInput) { return this.service.createCause(input); }
  @UseGuards(GqlAuthGuard) @Mutation(() => CauseGraph) updateCause(@Args('id') id: string, @Args('input') input: CauseInput) { return this.service.updateCause(id, input); }
  @UseGuards(GqlAuthGuard) @Mutation(() => CauseGraph) deleteCause(@Args('id') id: string) { return this.service.deleteCause(id); }

  @UseGuards(GqlAuthGuard) @Mutation(() => ImpactGraph) upsertImpactStatistic(@Args('id', { nullable: true }) id: string | undefined, @Args('input') input: ImpactStatisticInput) { return this.service.upsertImpact(id, input); }
  @UseGuards(GqlAuthGuard) @Mutation(() => ImpactGraph) deleteImpactStatistic(@Args('id') id: string) { return this.service.deleteImpact(id); }

  @UseGuards(GqlAuthGuard) @Mutation(() => MediaGraph) upsertMediaAsset(@Args('id', { nullable: true }) id: string | undefined, @Args('input') input: MediaAssetInput) { return this.service.upsertMedia(id, input); }
  @UseGuards(GqlAuthGuard) @Mutation(() => MediaGraph) deleteMediaAsset(@Args('id') id: string) { return this.service.deleteMedia(id); }

  @UseGuards(GqlAuthGuard) @Mutation(() => GalleryGraph) createGalleryItem(@Args('input') input: GalleryItemInput) { return this.service.createGallery(input); }
  @UseGuards(GqlAuthGuard) @Mutation(() => GalleryGraph) updateGalleryItem(@Args('id') id: string, @Args('input') input: GalleryItemInput) { return this.service.updateGallery(id, input); }
  @UseGuards(GqlAuthGuard) @Mutation(() => GalleryGraph) deleteGalleryItem(@Args('id') id: string) { return this.service.deleteGallery(id); }

  @UseGuards(GqlAuthGuard) @Mutation(() => NewsGraph) createNewsArticle(@Args('input') input: NewsArticleInput) { return this.service.createNews(input); }
  @UseGuards(GqlAuthGuard) @Mutation(() => NewsGraph) updateNewsArticle(@Args('id') id: string, @Args('input') input: NewsArticleInput) { return this.service.updateNews(id, input); }
  @UseGuards(GqlAuthGuard) @Mutation(() => NewsGraph) deleteNewsArticle(@Args('id') id: string) { return this.service.deleteNews(id); }
}
