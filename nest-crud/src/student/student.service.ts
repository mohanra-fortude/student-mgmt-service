import { Injectable } from '@nestjs/common';
import { CreateStudentInput } from './dto/create-student.input';
import { UpdateStudentInput } from './dto/update-student.input';
import { Student } from './entities/student.entity';
import { request, gql } from 'graphql-request';

@Injectable()
export class StudentService {
  

  endpoint = process.env.postGraphileEndpoint;
  create(createStudentInput: CreateStudentInput) {
    let date = new Date();
    let currentDate: number = date.getFullYear();
    let userBirthYear = parseInt(createStudentInput.dob.substring(0, 4));
    let age: number = currentDate - userBirthYear;
    createStudentInput.age = age;

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
      return data;
    });

  }

  createStudents(createStudentInputs: CreateStudentInput[]) {
    createStudentInputs.forEach((val: any, key: any) => {
      let date = new Date();
      let currentDate: number = date.getFullYear();
      let userBirthYear = parseInt(val.dob.substring(0, 4));
      let age: number = currentDate - userBirthYear;
      val.age = age;
    });

    const mutation = gql`
      mutation CreateStudents($createStudents: [StudentInput!]!) {
        createStudents(input: { createMultiple: $createStudents }) {
          __typename
        }
      }
    `;

    return request(this.endpoint, mutation, {
      createStudents: createStudentInputs,
    }).then((data) => {
      return data;
    });
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
    let userBirthYear = parseInt(updateStudentInput.dob.substring(0, 4));
    let age: number = currentDate - userBirthYear;
    updateStudentInput.age = age;

    const mutation = gql`
      mutation updateStudentById($id: Int!, $updateStudent: StudentPatch!) {
        updateStudentById(input: { studentPatch: $updateStudent, id: $id }) {
          __typename
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
        }
      }
    `;

    return request(this.endpoint, mutation, {
      id: id,
      updateStudent: updateStudentInput,
    }).then((data) => {
      return data;
    });
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
