import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { JwtAuthGuard } from '../auth/roles/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Role } from '../auth/roles/roles.decorator';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Retrieve all movies.' })
  findAll() {
    return this.moviesService.findAll();
  }

  @Get(':slug')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('regular')
  @ApiResponse({ status: 200, description: 'Retrieve a movie by its slug.' })
  @ApiResponse({ status: 404, description: 'Movie not found.' })
  findOne(@Param('slug') slug: string) {
    return this.moviesService.findOneBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('admin')
  @ApiBody({ type: CreateMovieDto })
  @ApiResponse({ status: 200, description: 'Movie successfully created.' })
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Put(':slug')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('admin')
  @ApiBody({ type: UpdateMovieDto })
  @ApiResponse({ status: 200, description: 'Movie successfully updated.' })
  update(@Param('slug') slug: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(slug, updateMovieDto);
  }

  @Delete(':slug')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('admin')
  @ApiResponse({ status: 200, description: 'Movie successfully deleted.' })
  remove(@Param('slug') slug: string) {
    return this.moviesService.remove(slug);
  }

  @Post('sync-star-wars')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('admin')
  @ApiResponse({ status: 200, description: 'Star Wars movies synchronized successfully.' })
  syncStarWarsMovies() {
    return this.moviesService.syncStarWarsMovies();
  }
  
}
