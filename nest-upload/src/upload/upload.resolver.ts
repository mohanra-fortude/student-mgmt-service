import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveReference,
} from '@nestjs/graphql';
import { UploadService } from './upload.service';
import { Upload } from './entities/upload.entity';

import { GraphQLUpload, FileUpload } from 'graphql-upload';


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

    return this.uploadService.uploadFile(createReadStream,filename);
    
  }

  // @ResolveReference()
  // resolveReference(reference: { __typename: string; id: number }): Upload {
  //   return this.uploadService.addToQueue();
  // }
}
