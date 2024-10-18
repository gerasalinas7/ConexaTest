import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from './schemas/movie.schema/movie.schema';
import axios from 'axios';
import { slugify } from '../shared/slugify';

@Injectable()
export class MoviesService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<MovieDocument>) {}

  async findAll(): Promise<Movie[]> {
    return this.movieModel.find().exec();
  }

  async findOne(id: string): Promise<Movie> {
    const movie = await this.movieModel.findById(id).exec();
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return movie;
  }

  async create(movieDto: any): Promise<Movie> {
    const newMovie = new this.movieModel(movieDto);
    return newMovie.save();
  }

  async update(id: string, updateDto: any): Promise<Movie> {
    const updatedMovie = await this.movieModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    if (!updatedMovie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return updatedMovie;
  }

  async remove(id: string): Promise<void> {
    const result = await this.movieModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
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