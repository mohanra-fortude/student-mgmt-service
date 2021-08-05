import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Student {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  dob?: string;

  @Column({ nullable: true })
  @Field((type) => Int, { nullable: true })
  age?: number;

  @Column({ nullable: true, default:1 })
  @Field((type) => Int, { nullable: true })
  isActive?: number;
}
