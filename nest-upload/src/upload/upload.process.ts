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
import * as SC from 'socketcluster-client';


let socket = SC.create({
  hostname: 'localhost',
  port: 8000,
});

// import { AppGateway } from 'src/app.gateway';

@Processor('bullForExcel')
export class UploadConsumer {
  constructor(private httpService: HttpService) {}
  @Process('create')
  createJob(job: Job) {

    let date = new Date();
    let currentDate: number = date.getFullYear();
    let userBirthYear = parseInt(job.data.dob.substring(0, 4));
    let age: number = currentDate - userBirthYear;

    const createStudentInput: Object = {
      name: job.data.name,
      dob: job.data.dob,
      email: job.data.email,
      age: age,
    };

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
  }

  @OnQueueCompleted()
  completed(job: Job, result: any) {
    (async () => {
      try {
        await socket.invokePublish(
          'myChannel',
          `Completed job ${job.id} of type ${job.name} with result ${result}`,
        );
      } catch (error) {
        Logger.log(error,'--error from cluster server')
      }
    })();
    Logger.log(
      `Completed job ${job.id} of type ${job.name} with result ${result}`,
    );
  }


  @OnQueueFailed()
  failed(job: Job, err: Error) {
    (async () => {
      try {
        await socket.invokePublish(
          'myChannel',
          `Failed joob ${job.id} of type ${job.name} with error ${err}`,
        );
      } catch (error) {
        Logger.log(error, '--error from cluster server');
      }
    })();
    Logger.log(
      `Failed joob ${job.id} of type ${job.name} with error ${err}...`,
    );
  }
}
