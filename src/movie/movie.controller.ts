import { Controller, Get, Post, Body, Param, Delete, HttpCode, UseGuards, Put } from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) { }

  @HttpCode(200)
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll() {
    return await this.movieService.getAll()
  }

  @HttpCode(200)
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOne(@Param('id') id: string) {
    return await this.movieService.getOne(id)
  }

  @HttpCode(201)
  @Post()
  @UseGuards(JwtAuthGuard)
  async createOne(@Body() body: CreateMovieDto) {
    return await this.movieService.createOne(body)
  }

  @HttpCode(200)
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateOne(@Param('id') id: string, @Body() body: UpdateMovieDto) {
    return await this.movieService.updateOne(id, body)
  }

  @HttpCode(204)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteOne(@Param('id') id: string) {
    return this.movieService.deleteOne(id)
  }
}
