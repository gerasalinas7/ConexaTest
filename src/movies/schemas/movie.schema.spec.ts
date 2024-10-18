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

  it('should create a movie', async () => {
    const movieData = {
      title: 'Star Wars: A New Hope',
      director: 'George Lucas',
      releaseDate: new Date('1977-05-25'),
      slug: 'star-wars-a-new-hope',
      genres: ['Sci-Fi', 'Adventure'],
    };

    const movie = new movieModel(movieData);
    expect(movie.title).toBe(movieData.title);
    expect(movie.director).toBe(movieData.director);
    expect(movie.releaseDate).toEqual(movieData.releaseDate);
    expect(movie.slug).toBe(movieData.slug);
    expect(movie.genres).toEqual(movieData.genres);
  });

  it('should throw an error if title is missing', async () => {
    const movieData = {
      director: 'George Lucas',
      releaseDate: new Date('1977-05-25'),
      slug: 'star-wars-a-new-hope',
      genres: ['Sci-Fi', 'Adventure'],
    };

    const movie = new movieModel(movieData);
    await expect(movie.validate()).rejects.toThrow();
  });

  it('should throw an error if slug is not unique', async () => {
    const existingMovieData = {
      title: 'Star Wars: The Empire Strikes Back',
      director: 'Irvin Kershner',
      releaseDate: new Date('1980-05-21'),
      slug: 'star-wars-a-new-hope', // Slug duplicado
      genres: ['Sci-Fi', 'Adventure'],
    };

    const existingMovie = new movieModel(existingMovieData);
    await existingMovie.save(); // Guarda el primer documento

    const duplicateMovieData = {
      title: 'Star Wars: Return of the Jedi',
      director: 'Richard Marquand',
      releaseDate: new Date('1983-05-25'),
      slug: 'star-wars-a-new-hope', // Slug duplicado
      genres: ['Sci-Fi', 'Adventure'],
    };

    const duplicateMovie = new movieModel(duplicateMovieData);
    await expect(duplicateMovie.save()).rejects.toThrow();
  });
});
