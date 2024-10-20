import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { getModelToken } from '@nestjs/mongoose';
import { Movie } from './schemas/movie.schema';
import { NotFoundException } from '@nestjs/common';
import { slugify } from '../shared/slugify';

const mockMovie = {
  title: 'Star Wars: A New Hope',
  director: 'George Lucas',
  releaseDate: new Date('1977-05-25'),
  description: 'A long time ago in a galaxy far, far away...',
  genres: ['Sci-Fi'],
  slug: 'star-wars-a-new-hope',
};

const mockMoviesArray = [mockMovie];

const mockMovieModel = {
  find: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockMoviesArray),
  }),
  findOne: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockMovie),
  }),
  findOneAndUpdate: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockMovie),
  }),
  findOneAndDelete: jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(mockMovie),
  }),
  create: jest.fn().mockResolvedValue(mockMovie),
  insertMany: jest.fn().mockResolvedValue(mockMoviesArray),
};

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getModelToken(Movie.name),
          useValue: mockMovieModel,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const result = await service.findAll();
      expect(result).toEqual(mockMoviesArray);
      expect(mockMovieModel.find).toHaveBeenCalled();
    });
  });

  describe('findOneBySlug', () => {
    it('should return a movie if found', async () => {
      const result = await service.findOneBySlug(mockMovie.slug);
      expect(result).toEqual(mockMovie);
      expect(mockMovieModel.findOne).toHaveBeenCalledWith({ slug: mockMovie.slug });
    });

    it('should throw NotFoundException if movie not found', async () => {
      mockMovieModel.findOne.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOneBySlug('invalid-slug')).rejects.toThrow(NotFoundException);
    });
  });


  describe('update', () => {
    it('should update a movie and return it', async () => {
      const updateMovieDto = { title: 'Star Wars: A New Hope - Special Edition' };

      const result = await service.update(mockMovie.slug, updateMovieDto);
      expect(result).toEqual(mockMovie);
      expect(mockMovieModel.findOneAndUpdate).toHaveBeenCalledWith(
        { slug: mockMovie.slug },
        { ...updateMovieDto, slug: slugify(updateMovieDto.title) },
        { new: true },
      );
    });

    it('should throw NotFoundException if movie not found', async () => {
      mockMovieModel.findOneAndUpdate.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.update(mockMovie.slug, { title: 'Invalid' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a movie', async () => {
      await service.remove(mockMovie.slug);
      expect(mockMovieModel.findOneAndDelete).toHaveBeenCalledWith({ slug: mockMovie.slug });
    });

    it('should throw NotFoundException if movie not found', async () => {
      mockMovieModel.findOneAndDelete.mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.remove('invalid-slug')).rejects.toThrow(NotFoundException);
    });
  });

});
