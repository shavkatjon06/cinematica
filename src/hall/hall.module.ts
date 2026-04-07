import { Module } from '@nestjs/common';
import { HallService } from './hall.service';
import { HallController } from './hall.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Hall, HallSchema } from 'src/schemas/hall.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hall.name, schema: HallSchema }
    ])
  ],
  controllers: [HallController],
  providers: [HallService],
})
export class HallModule {}
