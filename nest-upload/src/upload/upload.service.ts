import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
const excelToJson = require('convert-excel-to-json');
import { createWriteStream } from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  constructor(@InjectQueue('bullForExcel') private queue: Queue) {}

  uploadFile(createReadStream, filename) {
    const randomName = Array(4)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');

    console.log(filename, createReadStream, 'ffiffifle');

    let fileFirstName: string = path.parse(filename).name;
    let extension: string = path.extname(filename);
    const changedFileName = fileFirstName + '-' + randomName + extension;
    new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(`src/upload-folder/${changedFileName}`))
        .on('finish', (fin) => {
          resolve(true);
          const json = excelToJson({
            sourceFile: `./src/upload-folder/${changedFileName}`,
          });
          json.Sheet1.shift();
          try {
            this.queue.add('createStudents', {
              array: json.Sheet1,
            });
          } catch (error) {
            console.log(error);
          }
        })
        .on('error', (e) => {
          reject(false);
          console.log(e, process.cwd());
        }),
    );
    
  }
}
