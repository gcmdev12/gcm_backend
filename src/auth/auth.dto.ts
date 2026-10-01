import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
  @Field() @IsEmail() email!: string;
  @Field() @IsString() @MinLength(8) password!: string;
}

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true }) @IsString() firstName?: string;
  @Field({ nullable: true }) @IsString() lastName?: string;
  @Field({ nullable: true }) @IsEmail() email?: string;
}

@InputType()
export class ChangePasswordInput {
  @Field() @IsString() @MinLength(1) currentPassword!: string;
  @Field() @IsString() @MinLength(8) newPassword!: string;
}

@ObjectType()
export class AdminProfile {
  @Field() id!: string;
  @Field() email!: string;
  @Field() firstName!: string;
  @Field() lastName!: string;
  @Field() role!: string;
  @Field() isActive!: boolean;
}

@ObjectType()
export class LoginPayload {
  @Field() accessToken!: string;
  @Field(() => AdminProfile) admin!: AdminProfile;
}
