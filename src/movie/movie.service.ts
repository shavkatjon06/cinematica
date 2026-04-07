import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie, MovieDocument } from 'src/schemas/movie.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MovieService {
  constructor(@InjectModel(Movie.name) private movieModel: Model<MovieDocument>) { }

  async getAll() {
    return await this.movieModel.find({});
  }

  async getOne(id: string) {
    const movie = await this.movieModel.findOne({ _id: id })
    if (!movie) {
      throw new NotFoundException('Movie not found')
    }
    return movie
  }

  async createOne(body: CreateMovieDto) {
    return await this.movieModel.create(body)
  }

  async updateOne(id: string, body: UpdateMovieDto) {
    const movie = await this.movieModel.findOneAndUpdate({ _id: id }, body, { new: true })
    if (!movie) {
      throw new NotFoundException('Movie not found')
    }
    return movie
  }

  async deleteOne(id: string) {
    const movie = await this.movieModel.findOneAndDelete({ _id: id })
    if (!movie) {
      throw new NotFoundException("Movie not found")
    }
    return movie
  }
}
