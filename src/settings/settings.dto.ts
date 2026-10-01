import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

@InputType()
export class SiteSettingsInput {
  @Field({ nullable: true }) @IsOptional() @IsString() siteName?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() tagline?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() email?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() phone1?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() phone2?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() location?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() whatsapp?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() instagram?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() facebook?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() threads?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() tiktok?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() youtube?: string;
}

@InputType()
export class DonationMethodInput {
  @Field() @IsString() name!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() accountName?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() accountNumber?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() instructions?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() logoUrl?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() country?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() city?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() contactNumber?: string;
  @Field({ nullable: true, defaultValue: true }) @IsOptional() @IsBoolean() isActive?: boolean;
  @Field(() => Int, { nullable: true }) @IsOptional() @IsInt() @Min(0) sortOrder?: number;
}

@ObjectType()
export class SiteSettingsGraph { @Field() id!: number; @Field() siteName!: string; @Field() tagline!: string; @Field() email!: string; @Field({ nullable: true }) phone1?: string; @Field({ nullable: true }) phone2?: string; @Field({ nullable: true }) location?: string; @Field({ nullable: true }) whatsapp?: string; @Field({ nullable: true }) instagram?: string; @Field({ nullable: true }) facebook?: string; @Field({ nullable: true }) threads?: string; @Field({ nullable: true }) tiktok?: string; @Field({ nullable: true }) youtube?: string; }
@ObjectType()
export class DonationMethodGraph { @Field() id!: string; @Field() name!: string; @Field({ nullable: true }) accountName?: string; @Field({ nullable: true }) accountNumber?: string; @Field({ nullable: true }) instructions?: string; @Field({ nullable: true }) logoUrl?: string;
  @Field({ nullable: true }) country?: string;
  @Field({ nullable: true }) city?: string;
  @Field({ nullable: true }) contactNumber?: string; @Field() isActive!: boolean; @Field(() => Int) sortOrder!: number; }
