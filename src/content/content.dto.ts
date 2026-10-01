import { Field, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { GalleryCategory } from '../generated/prisma/enums';

registerEnumType(GalleryCategory, { name: 'GalleryCategory' });

@InputType()
export class CauseInput {
  @Field() @IsString() slug!: string;
  @Field() @IsString() name!: string;
  @Field() @IsString() description!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() imageUrl?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() icon?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() color?: string;
  @Field({ nullable: true, defaultValue: true }) @IsOptional() @IsBoolean() isActive?: boolean;
  @Field(() => Int, { nullable: true }) @IsOptional() @IsInt() @Min(0) sortOrder?: number;
}

@InputType()
export class ImpactStatisticInput {
  @Field() @IsString() key!: string;
  @Field() @IsString() label!: string;
  @Field() @IsString() value!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() description?: string;
  @Field(() => Int, { nullable: true }) @IsOptional() @IsInt() @Min(0) sortOrder?: number;
}

@InputType()
export class MediaAssetInput {
  @Field() @IsString() key!: string;
  @Field() @IsString() page!: string;
  @Field() @IsString() url!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() title?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() altText?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() description?: string;
}

@InputType()
export class GalleryItemInput {
  @Field() @IsString() title!: string;
  @Field() @IsString() imageUrl!: string;
  @Field() @IsString() category!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() description?: string;
  @Field({ nullable: true, defaultValue: true }) @IsOptional() @IsBoolean() isPublished?: boolean;
  @Field(() => Int, { nullable: true }) @IsOptional() @IsInt() @Min(0) sortOrder?: number;
}

@InputType()
export class NewsArticleInput {
  @Field() @IsString() title!: string;
  @Field() @IsString() slug!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() category?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() excerpt?: string;
  @Field() @IsString() content!: string;
  @Field({ nullable: true }) @IsOptional() @IsString() imageUrl?: string;
  @Field({ nullable: true, defaultValue: false }) @IsOptional() @IsBoolean() published?: boolean;
}

@ObjectType() export class CauseGraph { @Field() id!: string; @Field() slug!: string; @Field() name!: string; @Field() description!: string; @Field({ nullable: true }) imageUrl?: string; @Field({ nullable: true }) icon?: string; @Field({ nullable: true }) color?: string; @Field() isActive!: boolean; @Field(() => Int) sortOrder!: number; }
@ObjectType() export class ImpactGraph { @Field() id!: string; @Field() key!: string; @Field() label!: string; @Field() value!: string; @Field({ nullable: true }) description?: string; @Field(() => Int) sortOrder!: number; }
@ObjectType() export class MediaGraph { @Field() id!: string; @Field() key!: string; @Field() page!: string; @Field() url!: string; @Field({ nullable: true }) title?: string; @Field({ nullable: true }) altText?: string; @Field({ nullable: true }) description?: string; }
@ObjectType() export class GalleryGraph { @Field() id!: string; @Field() title!: string; @Field({ nullable: true }) description?: string; @Field() imageUrl!: string; @Field(() => GalleryCategory) category!: GalleryCategory; @Field() isPublished!: boolean; @Field(() => Int) sortOrder!: number; }
@ObjectType() export class NewsGraph { @Field() id!: string; @Field() title!: string; @Field() slug!: string; @Field() category!: string; @Field({ nullable: true }) excerpt?: string; @Field() content!: string; @Field({ nullable: true }) imageUrl?: string; @Field() published!: boolean; @Field({ nullable: true }) publishedAt?: Date; @Field() createdAt!: Date; }
