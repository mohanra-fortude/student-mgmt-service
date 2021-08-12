import { ObjectType, Field, Int, Directive, ID } from '@nestjs/graphql';

@ObjectType()
// @Directive('@key(fields: "id")')
export class Upload {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;

  // @Field((type) => ID)
  // id: number;
}
