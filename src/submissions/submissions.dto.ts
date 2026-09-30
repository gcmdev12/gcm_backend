import { Field, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsEmail, IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { SubmissionStatus } from '../generated/prisma/enums';

registerEnumType(SubmissionStatus, { name: 'SubmissionStatus' });

@InputType()
export class ContactSubmissionInput {
  @Field() @IsString() @MinLength(2) @MaxLength(120) name!: string;
  @Field() @IsEmail() email!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() phone?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() subject?: string;
  @Field() @IsString() @MinLength(3) @MaxLength(5000) message!: string;
}

@InputType()
export class VolunteerSubmissionInput {
  @Field() @IsString() @MinLength(2) name!: string;
  @Field() @IsEmail() email!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() phone?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() location?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() interests?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() availability?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() experience?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() message?: string;
}

@InputType()
export class NewsletterInput {
  @Field() @IsEmail() email!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() name?: string;
}

@InputType()
export class SubmissionStatusInput {
  @Field(() => SubmissionStatus) status!: SubmissionStatus;
}

@ObjectType()
export class SubmissionSummary {
  @Field(() => Int) contacts!: number;
  @Field(() => Int) volunteers!: number;
  @Field(() => Int) subscribers!: number;
}
