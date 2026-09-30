import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DashboardStats {
  @Field(() => Int) newContacts!: number;
  @Field(() => Int) newVolunteers!: number;
  @Field(() => Int) newSubscribers!: number;
  @Field(() => Int) causes!: number;
  @Field(() => Int) galleryItems!: number;
  @Field(() => Int) newsArticles!: number;
}
