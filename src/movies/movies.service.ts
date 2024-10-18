import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from './schemas/movie.schema';
import axios from 'axios';
import { slugify } from '../shared/slugify';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<MovieDocument>) {}

  async findAll(): Promise<Movie[]> {
    return this.movieModel.find().exec();
  }

  async findOneBySlug(slug: string): Promise<Movie> {
    const movie = await this.movieModel.findOne({ slug }).exec();
    if (!movie) {
      throw new NotFoundException(`Movie with slug ${slug} not found`);
    }
    return movie;
  }

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const slug = slugify(createMovieDto.title);
    const newMovie = new this.movieModel({ ...createMovieDto, slug });
    return newMovie.save();
  }

  async update(slug: string, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    if (updateMovieDto.title) {
      updateMovieDto = { ...updateMovieDto, slug: slugify(updateMovieDto.title) };
    }

    const updatedMovie = await this.movieModel.findOneAndUpdate(
      { slug },
      updateMovieDto,
      { new: true },
    ).exec();

    if (!updatedMovie) {
      throw new NotFoundException(`Movie with slug ${slug} not found`);
    }

    return updatedMovie;
  }

  async remove(slug: string): Promise<void> {
    const result = await this.movieModel.findOneAndDelete({ slug }).exec();
    if (!result) {
      throw new NotFoundException(`Movie with slug ${slug} not found`);
    }
  }

  async syncStarWarsMovies(): Promise<Movie[]> {
    const response = await axios.get('https://swapi.dev/api/films/');
    const movies = response.data.results.map(film => ({
        title: film.title,
        director: film.director,
        releaseDate: film.release_date,
        description: film.opening_crawl,
        genres: ['Sci-Fi'],
        slug: slugify(film.title),
    }));

    const existingMovies = await this.movieModel.find({ slug: { $in: movies.map(movie => movie.slug) } });
    const existingSlugs = existingMovies.map(movie => movie.slug);
    const newMovies = movies.filter(movie => !existingSlugs.includes(movie.slug));

    const savedMovies = await this.movieModel.insertMany(newMovies);
    
    const resultMovies = savedMovies.map(savedMovie => ({
        title: savedMovie.title,
        director: savedMovie.director,
        releaseDate: savedMovie.releaseDate,
        description: savedMovie.description,
        genres: savedMovie.genres,
        slug: savedMovie.slug,
    }));

    return resultMovies;
  }

}