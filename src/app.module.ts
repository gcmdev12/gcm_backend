import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { ContentModule } from './content/content.module';
import { SettingsModule } from './settings/settings.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { MediaModule } from './media/media.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      introspection: process.env.NODE_ENV !== 'production',
      graphiql: process.env.NODE_ENV !== 'production',
      context: ({ req }: { req: any }) => ({ req }),
    }),
    PrismaModule,
    AuthModule,
    EmailModule,
    SubmissionsModule,
    ContentModule,
    SettingsModule,
    DashboardModule,
    MediaModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
