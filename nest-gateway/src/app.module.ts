import { RemoteGraphQLDataSource } from '@apollo/gateway';
import { Module } from '@nestjs/common';
import { GATEWAY_BUILD_SERVICE, GraphQLGatewayModule } from '@nestjs/graphql';
import FileUploadDataSource from '@profusion/apollo-federation-upload';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    GraphQLGatewayModule.forRoot({
      server: {
        // ... Apollo server options
        cors: {
          credentials: true,
          allowedHeaders: [
            'Origin',
            'X-Requested-With',
            'content-type',
            'set-cookie',
            'cookie',
          ],
          methods: ['GET, POST, OPTIONS, PUT, PATCH, DELETE'],
        },
      },
      gateway: {
        buildService: ({ url }) =>
          new FileUploadDataSource({
            url,
            useChunkedTransfer: true,
            
          }),

        serviceList: [
          { name: 'student', url: 'http://localhost:3000/graphql' },
          { name: 'upload', url: 'http://localhost:3003/graphql' },
        ],
      },
    }),
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
