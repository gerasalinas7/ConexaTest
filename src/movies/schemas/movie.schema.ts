import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type MovieDocument = Movie & Document;

@Schema()
export class Movie {
  @ApiProperty({ description: 'The title of the movie', example: 'Star Wars: A New Hope' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ description: 'The director of the movie', example: 'George Lucas' })
  @Prop({ required: true })
  director: string;

  @ApiProperty({ description: 'The release date of the movie', example: '1977-05-25' })
  @Prop({ required: true })
  releaseDate: Date;

  @ApiProperty({ description: 'A brief description of the movie', required: false, example: 'A long time ago in a galaxy far, far away...' })
  @Prop()
  description?: string;

  @ApiProperty({ description: 'Unique slug for the movie', example: 'star-wars-a-new-hope', uniqueItems: true })
  @Prop({ required: true, unique: true })
  slug: string;

  @ApiProperty({ description: 'Genres of the movie', type: [String], example: ['Sci-Fi', 'Adventure'] })
  @Prop({ type: [String] })
  genres: string[];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
