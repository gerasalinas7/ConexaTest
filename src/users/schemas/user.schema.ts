import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema()
export class User {
  @ApiProperty({ description: 'The email of the user', example: 'user@example.com' })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ description: 'The password of the user', example: 'strongpassword123', minLength: 6 })
  @Prop({ required: true })
  password: string;

  @ApiProperty({ description: 'The role of the user', example: 'regular', default: 'regular' })
  @Prop({ default: 'regular' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
