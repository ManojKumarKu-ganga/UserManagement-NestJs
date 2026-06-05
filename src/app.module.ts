import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UploadScalar } from './graphql/scalars/upload.scalar';
import { ConfigModule } from '@nestjs/config';
import { config } from 'dotenv';
import { FileStorageModule } from './file-storage/file-storage.module';
import { AuthModule } from './auth/auth.module';
import appConfig from './config/app.config';
config();

const mongoUri = appConfig().database.uri;
if (!mongoUri) {
  throw new Error('Missing required environment variable: MONGO_URI');
}

@Module({
  imports: [
    MongooseModule.forRoot(mongoUri),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
      playground: true,
      path: '/graphql' 
    }),
    UsersModule,
    FileStorageModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
  ],

  controllers: [AppController],
  providers: [AppService, UploadScalar],
})



export class AppModule { }
