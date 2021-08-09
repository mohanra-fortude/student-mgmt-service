import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { StudentService } from './student.service';
import { Student } from './entities/student.entity';
import { CreateStudentInput } from './dto/create-student.input';
import { UpdateStudentInput } from './dto/update-student.input';
import { createWriteStream } from 'fs';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { MessagePattern } from '@nestjs/microservices';

@Resolver((of) => Student)
export class StudentResolver {
  constructor(private readonly studentService: StudentService) {}
  @Mutation(() => Student)
  createStudent(
    @Args('createStudentInput') createStudentInput: CreateStudentInput,
  ) {
    return this.studentService.create(createStudentInput);
  }

  @Mutation(() => Student)
  createStudents(
    @Args({ name: 'createStudentInput', type: () => [CreateStudentInput] }) createStudentInputs: CreateStudentInput[],
  ) {
    return this.studentService.createStudents(createStudentInputs);
  }

  

  @Query(() => [Student], { name: 'student' })
  findAll() {
    return this.studentService.findAll();
  }

  @Query(() => Student, { name: 'studentOne' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.studentService.findOne(id);
  }

  @Mutation(() => Student)
  updateStudent(
    @Args('updateStudentInput') updateStudentInput: UpdateStudentInput,
  ) {
    return this.studentService.update(
      updateStudentInput.id,
      updateStudentInput,
    );
  }

  @Mutation(() => Student)
  removeStudent(@Args('id', { type: () => Int }) id: number) {
    return this.studentService.remove(id);
  }
}
