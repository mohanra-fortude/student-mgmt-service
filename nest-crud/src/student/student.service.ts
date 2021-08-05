import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentInput } from './dto/create-student.input';
import { UpdateStudentInput } from './dto/update-student.input';
import { Student } from './entities/student.entity';

import { request, gql } from 'graphql-request';
import axios from 'axios';

@Injectable()
export class StudentService {
  // constructor(
  //   @InjectRepository(Student)
  //   private studentRepository: Repository<Student>,
  // ) {}

  endpoint = 'http://localhost:5000/graphql';
  create(createStudentInput: CreateStudentInput) {
    let date = new Date();
    let currentDate: number = date.getFullYear();
    let userBirthYear = parseInt(createStudentInput.dob.substring(0, 4));
    let age: number = currentDate - userBirthYear;
    console.log(userBirthYear, currentDate, age, 'dobb');
    createStudentInput.age = age;

    console.log(createStudentInput)

    const mutation = gql`
      mutation CreateStudent($createStudent: StudentInput!) {
        createStudent(input: { student: $createStudent }) {
          __typename
        }
      }
    `;

    return request(this.endpoint, mutation, {
      createStudent: createStudentInput,
    }).then((data) => {
      console.log;
      return data;
    });

    // const res = axios
    //   .post(this.endpoint, {
    //     query: mutation,
    //     variables: { createStudent: createStudentInput },
    //   })
    //   .then(
    //     (response) => {
    //       console.log(response.data);
    //     },
    //     (error) => {
    //       console.log(error);
    //     },
    //   );

    // console.log(res);
    // return res;

    // const newStudent = this.studentRepository.create(createStudentInput);
    // return this.studentRepository.save(newStudent);
  }

  findAll(): Promise<Student[]> {
    const query = gql`
      query {
        allStudents {
          nodes {
            id
            name
            age
            email
            dob
          }
        }
      }
    `;

    return request(this.endpoint, query).then((data) => {
      console.log(data);
      return data.allStudents.nodes;
    });
  }

  findOne(id: number) {
    const query = gql`
      query {
        studentById(id: ${id}) {
          id
          name
          email
          dob
          age
        }
      }
    `;

    return request(this.endpoint, query).then((data) => {
      return data.studentById;
    });
  }

  update(id: number, updateStudentInput: UpdateStudentInput) {
    let date = new Date();
    let currentDate: number = date.getFullYear();
    let userBirthYear = parseInt(updateStudentInput.dob.slice(-4));
    let age: number = currentDate - userBirthYear;
    console.log(userBirthYear, currentDate, age, updateStudentInput, 'dobb');
    updateStudentInput.age = age;

    const mutation = gql`
      mutation updateStudentById($id: Int!, $updateStudent: StudentPatch!) {
        updateStudentById(input: { studentPatch: $updateStudent, id: $id }) {
          __typename
        }
      }
    `;

    return request(this.endpoint, mutation, {
      id: id,
      updateStudent: updateStudentInput,
    }).then((data) => {
      return data;
    });
    // const updateStudent = this.studentRepository.create(updateStudentInput);
    // return this.studentRepository.update(
    //   { id: updateStudent.id },
    //   updateStudent,
    // );
  }

  remove(id: number) {
    const mutation = gql`
      mutation{
        deleteStudentById(input:{id:${id}}) {
          __typename
        }
      } 
    `;
    return request(this.endpoint, mutation).then((data) => {
      return data;
    });
  }
}
