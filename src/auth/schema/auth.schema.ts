import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type LoginDocument = Login & Document;
@Schema({timestamps: true}) 
export class Login {
    @Prop({ required: true, unique: true})
    email!:string;
    @Prop({ required: true})
    password!: string;
}

export const LoginSchema = SchemaFactory.createForClass(Login);