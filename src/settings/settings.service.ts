import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DonationMethodInput, SiteSettingsInput } from './settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  getSiteSettings() { return this.prisma.siteSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } }); }
  updateSiteSettings(input: SiteSettingsInput) { return this.prisma.siteSettings.upsert({ where: { id: 1 }, update: input, create: { id: 1, ...input } }); }

  donationMethods() { return this.prisma.donationMethod.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }); }
  allDonationMethods() { return this.prisma.donationMethod.findMany({ orderBy: { sortOrder: 'asc' } }); }
  createDonationMethod(input: DonationMethodInput) { return this.prisma.donationMethod.create({ data: input }); }
  updateDonationMethod(id: string, input: DonationMethodInput) { return this.prisma.donationMethod.update({ where: { id }, data: input }); }
  deleteDonationMethod(id: string) { return this.prisma.donationMethod.delete({ where: { id } }); }
}
