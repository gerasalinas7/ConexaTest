import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from './movie.schema';

describe('Movie Schema', () => {
  let movieModel: Model<MovieDocument>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Movie.name),
          useValue: Model, // Aquí se puede simular el modelo de Mongoose
        },
      ],
    }).compile();

    movieModel = module.get<Model<MovieDocument>>(getModelToken(Movie.name));
  });

  it('should be defined', () => {
    expect(movieModel).toBeDefined();
  });

});
