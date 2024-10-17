import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { JwtAuthGuard } from '../auth/roles/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Role } from '../auth/roles/roles.decorator';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.moviesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('admin')  // Solo los administradores pueden crear películas
  create(@Body() createMovieDto: any) {
    return this.moviesService.create(createMovieDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('admin')  // Solo los administradores pueden actualizar películas
  update(@Param('id') id: string, @Body() updateMovieDto: any) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('admin')  // Solo los administradores pueden eliminar películas
  remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }

  @Post('sync-star-wars')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('admin')
  syncStarWarsMovies() {
    return this.moviesService.syncStarWarsMovies();
  }
  
}
