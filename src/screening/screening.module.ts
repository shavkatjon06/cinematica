import { Module } from '@nestjs/common';
import { ScreeningService } from './screening.service';
import { ScreeningController } from './screening.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Screening, ScreeningSchema } from 'src/schemas/screening.schema';
import { Movie, MovieSchema } from 'src/schemas/movie.schema';
import { Hall, HallSchema } from 'src/schemas/hall.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Screening.name, schema: ScreeningSchema },
      { name: Movie.name, schema: MovieSchema },
      { name: Hall.name, schema: HallSchema }
    ])
  ],
  controllers: [ScreeningController],
  providers: [ScreeningService],
})
export class ScreeningModule { }
