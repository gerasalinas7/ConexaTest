import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { JwtService } from '@nestjs/jwt'; 
import { RolesGuard } from '../auth/roles/roles.guard'; 
import { NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

// Mock data and services
const mockMovie = {
  title: 'Star Wars: A New Hope',
  director: 'George Lucas',
  releaseDate: new Date('1977-05-25'),
  description: 'The first Star Wars movie.',
  genres: ['Sci-Fi'],
  slug: 'star-wars-a-new-hope',
};

const mockMoviesService = {
  findAll: jest.fn(),
  findOneBySlug: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  syncStarWarsMovies: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

describe('MoviesController', () => {
  let controller: MoviesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: RolesGuard,
          useValue: {}, 
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      mockMoviesService.findAll.mockResolvedValue([mockMovie]);

      const movies = await controller.findAll();
      expect(movies).toEqual([mockMovie]);
    });
  });

  describe('findOne', () => {
    it('should return a movie by slug', async () => {
      mockMoviesService.findOneBySlug.mockResolvedValue(mockMovie);

      const movie = await controller.findOne(mockMovie.slug);
      expect(movie).toEqual(mockMovie);
    });

    it('should throw a NotFoundException if movie not found', async () => {
      mockMoviesService.findOneBySlug.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('invalid-slug')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new movie', async () => {
      mockMoviesService.create.mockResolvedValue(mockMovie);

      const createMovieDto: CreateMovieDto = {
        title: mockMovie.title,
        director: mockMovie.director,
        releaseDate: mockMovie.releaseDate,
        description: mockMovie.description,
        genres: mockMovie.genres,
      };

      const movie = await controller.create(createMovieDto);
      expect(movie).toEqual(mockMovie);
    });
  });

  describe('update', () => {
    it('should update a movie by slug', async () => {
      mockMoviesService.update.mockResolvedValue(mockMovie);

      const updateMovieDto: UpdateMovieDto = {
        title: 'Updated Title',
      };

      const movie = await controller.update(mockMovie.slug, updateMovieDto);
      expect(movie).toEqual(mockMovie);
    });

    it('should throw a NotFoundException if movie not found', async () => {
      mockMoviesService.update.mockRejectedValue(new NotFoundException());

      await expect(controller.update(mockMovie.slug, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a movie by slug', async () => {
      mockMoviesService.remove.mockResolvedValue(undefined);

      await controller.remove(mockMovie.slug);
      expect(mockMoviesService.remove).toHaveBeenCalledWith(mockMovie.slug);
    });

    it('should throw a NotFoundException if movie not found', async () => {
      mockMoviesService.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.remove(mockMovie.slug)).rejects.toThrow(NotFoundException);
    });
  });

  describe('syncStarWarsMovies', () => {
    it('should sync Star Wars movies successfully', async () => {
      mockMoviesService.syncStarWarsMovies.mockResolvedValue([mockMovie]);

      const movies = await controller.syncStarWarsMovies();
      expect(movies).toEqual([mockMovie]);
    });
  });
});
