import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHallDto } from './dto/create-hall.dto';
import { UpdateHallDto } from './dto/update-hall.dto';
import { Hall, HallDocument } from 'src/schemas/hall.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class HallService {
  constructor(@InjectModel(Hall.name) private hallModel: Model<HallDocument>) { }

  async getAll() {
    return await this.hallModel.find({});
  }

  async getOne(id: string) {
    const hall = await this.hallModel.findOne({ _id: id })
    if (!hall) {
      throw new NotFoundException('Hall not found')
    }
    return hall
  }

  async createOne(body: CreateHallDto) {
    return await this.hallModel.create(body)
  }

  async updateOne(id: string, body: UpdateHallDto) {
    const hall = await this.hallModel.findOneAndUpdate({ _id: id }, body, { new: true })
    if (!hall) {
      throw new NotFoundException('Hall not found')
    }
    return hall
  }

  async deleteOne(id: string) {
    const hall = await this.hallModel.findOneAndDelete({ _id: id })
    if (!hall) {
      throw new NotFoundException("Hall not found")
    }
    return hall
  }
}
