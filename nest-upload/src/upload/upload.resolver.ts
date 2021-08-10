import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UploadService } from './upload.service';
import { Upload } from './entities/upload.entity';

import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import * as path from 'path';

@Resolver(() => Upload)
export class UploadResolver {
  constructor(private readonly uploadService: UploadService) {}

  // @Mutation(() => Upload)
  // createUpload(@Args('createUploadInput') createUploadInput: CreateUploadInput) {
  //   return this.uploadService.create(createUploadInput);
  // }

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Mutation((returns) => Boolean!, { nullable: true })
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename }: FileUpload,
  ) {
    const randomName = Array(4)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');

    let fileFirstName: string = path.parse(filename).name;
    let extension: string = path.extname(filename);
    const changedFileName = fileFirstName +"-"+randomName + extension;
    return new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(`./src/upload-folder/${changedFileName}`))
        .on('finish', (fin) => {
          resolve(true);
          this.uploadService.addToQueue(changedFileName);
        })
        .on('error', (e) => {
          reject(false);
          console.log(e, process.cwd());
        }),
    );
  }
}
