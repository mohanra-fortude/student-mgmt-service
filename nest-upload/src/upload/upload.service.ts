import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
const excelToJson = require('convert-excel-to-json');



@Injectable()
export class UploadService {
  constructor(@InjectQueue('bullForExcel') private queue: Queue) { }
  
  addToQueue(filename) {
    
    const json = excelToJson({
      sourceFile: `./src/upload-folder/${filename}`,
    });

    json.Sheet1.shift();
    console.log(process.cwd(),json.Sheet1);
    json.Sheet1.map(async (val, key) => {
      console.log(val);
      try {
        // const date:string = val.C.toISOString().substring(0, 10);
        await this.queue.add('create', {
          id: val.A,
          name: val.B,
          dob: val.C,
          email:val.D
        });
      } catch (error) {
        console.log(error)
      }
      
    });

    // console.log('done');

    //   const student = {
    // Sheet1: [
    //   { A: 'id', B: 'name', C: 'dob' },
    //   { A: 1, B: 'mohan', C: 2000-11-10T18:29:50.000Z },
    //   { A: 2, B: 'drax', C: 1998-02-08T18:29:50.000Z }
    // ]
  }
}
