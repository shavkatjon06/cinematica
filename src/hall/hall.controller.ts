import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards, Put } from '@nestjs/common';
import { HallService } from './hall.service';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';

@Controller('hall')
export class HallController {
  constructor(private readonly hallService: HallService) { }

  @HttpCode(200)
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll() {
    return await this.hallService.getAll()
  }

  @HttpCode(200)
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOne(@Param('id') id: string) {
    return await this.hallService.getOne(id)
  }

  @HttpCode(201)
  @Post()
  @UseGuards(JwtAuthGuard)
  async createOne(@Body() body: CreateHallDto) {
    return await this.hallService.createOne(body)
  }

  @HttpCode(200)
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateOne(@Param('id') id: string, @Body() body: UpdateHallDto) {
    return await this.hallService.updateOne(id, body)
  }

  @HttpCode(204)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteOne(@Param('id') id: string) {
    return this.hallService.deleteOne(id)
  }
}
