import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UploadScalar } from './graphql/scalars/upload.scalar';
import { config } from 'dotenv';


config();

const mongoUri = process.env.MONGO_URI;


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
  ],
  controllers: [AppController],
  providers: [AppService, UploadScalar],
})



export class AppModule { }
