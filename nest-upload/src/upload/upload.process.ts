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
  @Process('createStudents')
  createJob(job: Job) {

    let createStudentInput = []
    console.log(job.data, 'jobdata')

    job.data.array.map((val: any, key: any) => {
      console.log(val,'valll')
      let date = new Date();
      let currentDate: number = date.getFullYear();
      let userBirthYear = parseInt(val.C.substring(0, 4));
      let age: number = currentDate - userBirthYear;

      let obj: Object = {
        id: val.A,
        name: val.B,
        email: val.D,
        dob: val.C,
        age: age,
      };


      createStudentInput.push(obj)
    })

   console.log(createStudentInput, 'the object');

    const mutation = gql`
      mutation ($createStudents:[CreateStudentInput!]!){
        createStudents(createStudentInput: $createStudents) {
          __typename
        }
      }
    `;

    return request('http://localhost:3000/graphql', mutation, {
      createStudents: createStudentInput,
    }).then((data) => {
      return data;
    });
  }

  @OnQueueCompleted()
  completed(job: Job, result: any) {
    (async () => {
      try {
        console.log(result)
        await socket.invokePublish(
          'myChannel',
          `Completed job with result ${result}`,
        );
      } catch (error) {
        Logger.log(error,'--error from cluster server')
      }
    })();
    Logger.log(
      `Completed job with result ${result}`,
    );
  }


  @OnQueueFailed()
  failed(job: Job, err: Error) {
    (async () => {
      try {
        await socket.invokePublish(
          'myChannel',
          `Failed job with error ${err}`,
        );
      } catch (error) {
        Logger.log(error, '--error from cluster server');
      }
    })();
    Logger.log(
      `Failed job with error ${err}...`,
    );
  }
}
