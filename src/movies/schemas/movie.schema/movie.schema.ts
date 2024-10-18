import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema()
export class Movie {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  director: string;

  @Prop({ required: true })
  releaseDate: Date;

  @Prop()
  description?: string;

  @Prop({ required: true, unique: true })
  slug: string; 

  @Prop([String])
  genres: string[];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);