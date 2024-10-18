import { IsString, IsNotEmpty, IsArray, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({
    description: 'The title of the movie',
    example: 'Star Wars: A New Hope',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The director of the movie',
    example: 'George Lucas',
  })
  @IsString()
  @IsNotEmpty()
  director: string;

  @ApiProperty({
    description: 'The release date of the movie',
    example: '1977-05-25',
  })
  @IsDateString()
  @IsNotEmpty()
  releaseDate: Date;

  @ApiProperty({
    description: 'A brief description of the movie',
    example: 'A long time ago in a galaxy far, far away...',
    required: false,
  })
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Genres of the movie',
    example: ['Sci-Fi', 'Adventure'],
  })
  @IsArray()
  @IsString({ each: true })
  genres: string[];

  @ApiProperty({
    description: 'The slug generated from the movie title',
    example: 'star-wars-a-new-hope',
    required: false,
  })
  @IsString()
  @IsOptional()
  slug?: string;
}
