import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/auth.guard';
import { DonationMethodGraph, DonationMethodInput, SiteSettingsGraph, SiteSettingsInput } from './settings.dto';
import { SettingsService } from './settings.service';

@Resolver()
export class SettingsResolver {
  constructor(private readonly service: SettingsService) {}

  @Query(() => SiteSettingsGraph) siteSettings() { return this.service.getSiteSettings(); }
  @Query(() => [DonationMethodGraph]) donationMethods() { return this.service.donationMethods(); }

  @UseGuards(GqlAuthGuard) @Mutation(() => SiteSettingsGraph) updateSiteSettings(@Args('input') input: SiteSettingsInput) { return this.service.updateSiteSettings(input); }
  @UseGuards(GqlAuthGuard) @Query(() => [DonationMethodGraph]) adminDonationMethods() { return this.service.allDonationMethods(); }
  @UseGuards(GqlAuthGuard) @Mutation(() => DonationMethodGraph) createDonationMethod(@Args('input') input: DonationMethodInput) { return this.service.createDonationMethod(input); }
  @UseGuards(GqlAuthGuard) @Mutation(() => DonationMethodGraph) updateDonationMethod(@Args('id') id: string, @Args('input') input: DonationMethodInput) { return this.service.updateDonationMethod(id, input); }
  @UseGuards(GqlAuthGuard) @Mutation(() => DonationMethodGraph) deleteDonationMethod(@Args('id') id: string) { return this.service.deleteDonationMethod(id); }
}
