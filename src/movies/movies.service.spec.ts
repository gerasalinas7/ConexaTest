import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { getModelToken } from '@nestjs/mongoose';
import { Movie } from './schemas/movie.schema';
import { NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { CreateMovieDto } from './dto/create-movie.dto';

const mockMovieModel = {
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  save: jest.fn(),
  insertMany: jest.fn(),
};

jest.mock('axios');

describe('MoviesService', () => {
  let moviesService: MoviesService;
  let movieModel;

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

    moviesService = module.get<MoviesService>(MoviesService);
    movieModel = module.get(getModelToken(Movie.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('debería retornar una lista de películas', async () => {
      const movieArray = [{ title: 'Movie 1' }, { title: 'Movie 2' }];
      movieModel.find.mockResolvedValue(movieArray);

      const result = await moviesService.findAll();
      expect(result).toEqual(movieArray);
      expect(movieModel.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('debería retornar una película por ID', async () => {
      const movie = { title: 'Movie 1' };
      movieModel.findById.mockResolvedValue(movie);

      const result = await moviesService.findOne('123');
      expect(result).toEqual(movie);
      expect(movieModel.findById).toHaveBeenCalledWith('123');
    });

    it('debería lanzar NotFoundException si la película no existe', async () => {
      movieModel.findById.mockResolvedValue(null);

      await expect(moviesService.findOne('123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('debería crear y retornar una nueva película', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'New Movie',
        director: 'Director Name',
        releaseDate: new Date('2023-01-01'),
        genres: ['Action', 'Adventure'], 
      };
      
      const savedMovie = { ...createMovieDto, slug: 'new-movie' };
      movieModel.save.mockResolvedValue(savedMovie);
  
      const result = await moviesService.create(createMovieDto);
      expect(result).toEqual(savedMovie);
      expect(movieModel.save).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('debería actualizar y retornar la película existente', async () => {
      const updateMovieDto = { title: 'Updated Movie' };
      const updatedMovie = { ...updateMovieDto, slug: 'updated-movie' };
      movieModel.findByIdAndUpdate.mockResolvedValue(updatedMovie);

      const result = await moviesService.update('123', updateMovieDto);
      expect(result).toEqual(updatedMovie);
      expect(movieModel.findByIdAndUpdate).toHaveBeenCalledWith('123', expect.anything(), { new: true });
    });

    it('debería lanzar NotFoundException si la película no existe', async () => {
      movieModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(moviesService.update('123', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('debería eliminar una película', async () => {
      movieModel.findByIdAndDelete.mockResolvedValue({ title: 'Movie to delete' });

      await moviesService.remove('123');
      expect(movieModel.findByIdAndDelete).toHaveBeenCalledWith('123');
    });

    it('debería lanzar NotFoundException si la película no existe', async () => {
      movieModel.findByIdAndDelete.mockResolvedValue(null);

      await expect(moviesService.remove('123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('syncStarWarsMovies', () => {
    it('debería sincronizar películas de Star Wars y retornar las nuevas películas', async () => {
      const swMovies = [
        { title: 'A New Hope', director: 'George Lucas', release_date: '1977-05-25', opening_crawl: 'In a galaxy far, far away...' },
      ];
      
      (axios.get as jest.Mock).mockResolvedValue({ data: { results: swMovies } });

      const newMovies = [{ ...swMovies[0], slug: 'a-new-hope', genres: ['Sci-Fi'] }];
      (movieModel.insertMany as jest.Mock).mockResolvedValue(newMovies);

      const result = await moviesService.syncStarWarsMovies();
      expect(result).toEqual(newMovies);
      expect(axios.get).toHaveBeenCalledWith('https://swapi.dev/api/films/');
      expect(movieModel.insertMany).toHaveBeenCalledWith(newMovies);
    });
  });
});
