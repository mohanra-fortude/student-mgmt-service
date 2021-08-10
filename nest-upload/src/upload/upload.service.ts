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
    json.Sheet1.map(async (val, key) => {
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

  }
}
