import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class CreateStudentInput {
  @Field({ nullable: true })
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  dob: string;

  @Field({ nullable: true })
  age?: number;
}
