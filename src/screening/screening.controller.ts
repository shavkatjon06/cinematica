import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, Query, Put } from '@nestjs/common';
import { ScreeningService } from './screening.service';
import { CreateScreeningDto } from './dto/create-screening.dto';
import { UpdateScreeningDto } from './dto/update-screening.dto';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { PaginDto } from 'src/common/dto/pagin.dto';

@Controller('screening')
export class ScreeningController {
  constructor(private readonly screeningService: ScreeningService) { }

  @HttpCode(200)
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(@Query() query: PaginDto) {
    return await this.screeningService.getAll(query)
  }

  @HttpCode(200)
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOne(@Param('id') id: string) {
    return await this.screeningService.getOne(id)
  }

  @HttpCode(201)
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createScreeningDto: CreateScreeningDto) {
    return this.screeningService.create(createScreeningDto);
  }

  @HttpCode(200)
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateOne(@Param('id') id: string, @Body() body: UpdateScreeningDto) {
    return await this.screeningService.updateOne(id, body)
  }

  @HttpCode(204)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteOne(@Param('id') id: string) {
    return this.screeningService.deleteOne(id)
  }
}
