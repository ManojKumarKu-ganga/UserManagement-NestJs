import { Scalar } from '@nestjs/graphql';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

@Scalar('Upload')
export class UploadScalar {
  description = GraphQLUpload.description;
  parseValue = GraphQLUpload.parseValue.bind(GraphQLUpload);
  serialize = GraphQLUpload.serialize.bind(GraphQLUpload);
  parseLiteral = GraphQLUpload.parseLiteral.bind(GraphQLUpload);
}
