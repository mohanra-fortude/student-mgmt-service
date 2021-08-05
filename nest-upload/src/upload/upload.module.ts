import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadResolver } from './upload.resolver';
import { BullModule } from '@nestjs/bull';
import { UploadConsumer } from './upload.process';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'bullForExcel',
      redis: {
        port: 6379,
      },
    }),
    HttpModule,
  ],
  providers: [UploadResolver, UploadService, UploadConsumer],
})
export class UploadModule {}
