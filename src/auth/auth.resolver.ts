import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminProfile, ChangePasswordInput, LoginInput, LoginPayload, UpdateProfileInput } from './auth.dto';
import { GqlAuthGuard } from './auth.guard';
import { AuthUser } from './auth.types';

@Resolver()
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Mutation(() => LoginPayload)
  login(@Args('input') input: LoginInput) { return this.auth.login(input); }

  @UseGuards(GqlAuthGuard)
  @Query(() => AdminProfile)
  me(@Context() ctx: { req: { user: AuthUser } }) { return this.auth.profile(ctx.req.user.sub); }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => AdminProfile)
  updateMyProfile(@Args('input') input: UpdateProfileInput, @Context() ctx: { req: { user: AuthUser } }) {
    return this.auth.updateProfile(ctx.req.user.sub, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  changeMyPassword(@Args('input') input: ChangePasswordInput, @Context() ctx: { req: { user: AuthUser } }) {
    return this.auth.changePassword(ctx.req.user.sub, input);
  }
}
