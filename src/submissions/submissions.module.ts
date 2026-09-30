import { Module } from '@nestjs/common';
import { EmailModule } from '../email/email.module';
import { SubmissionsResolver } from './submissions.resolver';
import { SubmissionsService } from './submissions.service';

@Module({ imports: [EmailModule], providers: [SubmissionsResolver, SubmissionsService] })
export class SubmissionsModule {}
