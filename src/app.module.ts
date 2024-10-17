import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://gerardosalinas96:Qsc5EH8XEUHeTemL@cluster0.gvhad.mongodb.net/movieDB?retryWrites=true&w=majority&appName=Cluster0'),
    AuthModule,
    UsersModule,
    MoviesModule,
  ],
})
export class AppModule {}