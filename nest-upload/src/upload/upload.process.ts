import { HttpService } from '@nestjs/common';
import {
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { request, gql } from 'graphql-request';
import axios from 'axios';
// import { AppGateway } from 'src/app.gateway';

@Processor('bullForExcel')
export class UploadConsumer {
  constructor(private httpService: HttpService) {}
  @Process('create')
  createJob(job: Job) {
    console.log('createCandidate1', job.data);

    const createStudentInput: Object = {
      name: job.data.name,
      dob: job.data.dob,
      email: job.data.email
    }

  //    {`{name:"${job.data.name}",dob:"${job.data.dob}",email:"${job.data.email}"}`
  // };

    // const mutation = gql`
    //   mutation CreateStudent($createStudent: CreateStudentInput!) {
    //     createStudent(createStudentInput: $createStudent }) {
    //       __typename
    //     }
    //   }
    // `;

    const mutation = gql`
      mutation CreateStudent($createStudent: StudentInput!) {
        createStudent(input: { student: $createStudent }) {
          __typename
        }
      }
    `;

    return request('http://localhost:5000/graphql', mutation, {
      createStudent: createStudentInput,
    }).then((data) => {
      return data;
    });

    // const res = axios.post("http://localhost:3000/graphql", {
    //   query: mutation,
    //   variables: { createStudent: createStudentInput }
    // }).then((response) => {
    //   console.log(response.data);
    // }, (error) => {
    //   console.log(error);
    // });
    // return res;
  }

  @OnQueueCompleted()
  completed(job: Job, result: any) {
    // websocket code
    // this.appGateway.wss.emit(
    //   'message',
    //   `Completed job ${job.id} of type ${job.name} with result ${result}`,
    // );
    Logger.log(
      `Completed job ${job.id} of type ${job.name} with result ${result}`,
    );
  }

  @OnQueueFailed()
  failed(job: Job, err: Error) {
    //websocket code
    // this.appGateway.handleMessage(
    //   `Failed job ${job.id} of type ${job.name} with error ${err}...`,
    // );
    Logger.log(`Failed job ${job.id} of type ${job.name} with error ${err}...`);
  }
}
