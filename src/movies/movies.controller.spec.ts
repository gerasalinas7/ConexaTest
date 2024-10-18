import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './schemas/movie.schema';

describe('MoviesController', () => {
  let moviesController: MoviesController;
  let moviesService: MoviesService;

  const mockMoviesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    syncStarWarsMovies: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
      ],
    }).compile();

    moviesController = module.get<MoviesController>(MoviesController);
    moviesService = module.get<MoviesService>(MoviesService);
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const result: Movie[] = [
        { 
          title: 'A New Hope', 
          director: 'George Lucas', 
          releaseDate: new Date('1977-05-25'), 
          genres: ['Sci-Fi'], 
          slug: 'a-new-hope' // Incluyendo slug aquí
        },
      ];
      mockMoviesService.findAll.mockResolvedValue(result);

      expect(await moviesController.findAll()).toBe(result);
      expect(moviesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single movie', async () => {
      const result: Movie = { 
        title: 'A New Hope', 
        director: 'George Lucas', 
        releaseDate: new Date('1977-05-25'), 
        genres: ['Sci-Fi'], 
        slug: 'a-new-hope' // Incluyendo slug aquí
      };
      mockMoviesService.findOne.mockResolvedValue(result);

      expect(await moviesController.findOne('1')).toBe(result);
      expect(moviesService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new movie', async () => {
      const createMovieDto: CreateMovieDto = { 
        title: 'A New Hope', 
        director: 'George Lucas', 
        releaseDate: new Date('1977-05-25'), 
        genres: ['Sci-Fi'] 
      };
      const result: Movie = { 
        ...createMovieDto, 
        slug: 'a-new-hope', // Asegúrate de incluir slug aquí también
        // _id: '1' 
      };
      mockMoviesService.create.mockResolvedValue(result);

      expect(await moviesController.create(createMovieDto)).toBe(result);
      expect(moviesService.create).toHaveBeenCalledWith(createMovieDto);
    });
  });

  describe('update', () => {
    it('should update an existing movie', async () => {
      const updateMovieDto: UpdateMovieDto = { title: 'A New Hope - Remastered' };
      const result: Movie = { 
        title: 'A New Hope - Remastered', 
        director: 'George Lucas', 
        releaseDate: new Date('1977-05-25'), 
        genres: ['Sci-Fi'], 
        slug: 'a-new-hope' // Asegúrate de que la propiedad slug esté presente
      };
      mockMoviesService.update.mockResolvedValue(result);

      expect(await moviesController.update('1', updateMovieDto)).toBe(result);
      expect(moviesService.update).toHaveBeenCalledWith('1', updateMovieDto);
    });
  });

  describe('remove', () => {
    it('should delete a movie', async () => {
      mockMoviesService.remove.mockResolvedValue(undefined);

      await moviesController.remove('1');
      expect(moviesService.remove).toHaveBeenCalledWith('1');
    });
  });

  describe('syncStarWarsMovies', () => {
    it('should synchronize Star Wars movies', async () => {
      const result: Movie[] = [
        { 
          title: 'A New Hope', 
          director: 'George Lucas', 
          releaseDate: new Date('1977-05-25'), 
          genres: ['Sci-Fi'], 
          slug: 'a-new-hope' // Asegúrate de que slug esté presente
        },
      ];
      mockMoviesService.syncStarWarsMovies.mockResolvedValue(result);

      expect(await moviesController.syncStarWarsMovies()).toBe(result);
      expect(moviesService.syncStarWarsMovies).toHaveBeenCalled();
    });
  });
});
