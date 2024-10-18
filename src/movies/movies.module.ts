import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { Movie, MovieSchema } from './schemas/movie.schema/movie.schema';
import { RolesGuard } from '../auth/roles/roles.guard';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]), 
    AuthModule,
  ],
  controllers: [MoviesController],
  providers: [MoviesService, RolesGuard],
  exports: [MoviesService], 
})
export class MoviesModule {}