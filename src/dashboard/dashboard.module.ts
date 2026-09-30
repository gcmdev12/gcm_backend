import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { DashboardResolver } from './dashboard.resolver';

@Module({
  imports: [AuthModule, PrismaModule],
  providers: [DashboardResolver],
})
export class DashboardModule {}