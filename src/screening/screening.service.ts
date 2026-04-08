import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateScreeningDto } from './dto/create-screening.dto';
import { UpdateScreeningDto } from './dto/update-screening.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Screening, ScreeningDocument } from 'src/schemas/screening.schema';
import { Model, Types } from 'mongoose';
import { Movie, MovieDocument } from 'src/schemas/movie.schema';
import { Hall, HallDocument } from 'src/schemas/hall.schema';
import { PaginDto } from 'src/common/dto/pagin.dto';

@Injectable()
export class ScreeningService {
  constructor(
    @InjectModel(Screening.name) private screeningModel: Model<ScreeningDocument>,
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    @InjectModel(Hall.name) private hallModel: Model<HallDocument>
  ) { }

  async getAll(query: PaginDto) {
    const { page, pageSize } = query
    const pipeline = [
      {
        $lookup: {
          from: 'movies',
          localField: 'movieId',
          foreignField: '_id',
          as: 'movie'
        }
      },
      { $unwind: '$movie' },
      {
        $lookup: {
          from: 'halls',
          localField: 'hallId',
          foreignField: '_id',
          as: 'hall'
        }
      },
      { $unwind: '$hall' },
      {
        $project: {
          startTime: 1,
          endTime: 1,
          price: 1,
          'movie.title': 1,
          'movie.duration': 1,
          'hall.name': 1
        }
      },
      {
        $facet: {
          metadata: [{ $count: 'totalCount' }],
          data: [
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize }
          ]
        }
      }
    ]
    const data = await this.screeningModel.aggregate(pipeline)
    const totalCount = data[0].metadata[0]?.totalCount || 0
    return {
      totalCount, page, pageSize, data: data[0].data
    }
  }

  async getOne(id: string) {
    const pipeline = [
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'movies',
          localField: 'movieId',
          foreignField: '_id',
          as: 'movie'
        }
      },
      { $unwind: '$movie' },
      {
        $lookup: {
          from: 'halls',
          localField: 'hallId',
          foreignField: '_id',
          as: 'hall'
        }
      },
      { $unwind: '$hall' },
      {
        $project: {
          startTime: 1,
          endTime: 1,
          price: 1,
          'movie.title': 1,
          'movie.duration': 1,
          'hall.name': 1
        }
      }
    ]
    const data = await this.screeningModel.aggregate(pipeline)
    return data[0]
  }

  async create(body: CreateScreeningDto) {
    const session = await this.screeningModel.db.startSession();
    session.startTransaction();

    try {
      const movie = await this.movieModel.findById(body.movieId).session(session)
      if (!movie) throw new NotFoundException('Movie not found')
      const hall = await this.hallModel.findById(body.hallId).session(session)
      if (!hall) throw new NotFoundException('Hall not found')

      const start = new Date(body.startTime)
      const duration = movie.duration * 60 * 1000
      const breakInMs = 20 * 60 * 1000
      const end = new Date(start.getTime() + duration + breakInMs)

      const overlap = await this.screeningModel.findOne({
        hallId: new Types.ObjectId(body.hallId),
        startTime: { $lt: end },
        endTime: { $gt: start }
      }).session(session);
      if (overlap) {
        throw new BadRequestException(`Hall is busy during this time: ${overlap.startTime.toUTCString()} - ${overlap.endTime.toUTCString()}`)
      }

      let screening = await this.screeningModel.create(
        [{
          movieId: movie._id,
          hallId: hall._id,
          startTime: start,
          endTime: end,
          price: body.price
        }], { session }
      )

      await session.commitTransaction();
      return screening[0];
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  }

  async updateOne(id: string, body: UpdateScreeningDto) {
    const session = await this.screeningModel.db.startSession()
    session.startTransaction()

    try {
      const screening = await this.screeningModel.findById(id).session(session)
      if (!screening) throw new NotFoundException('Screening not found')
      const movie = await this.movieModel.findById(body.movieId).session(session)
      if (!movie) throw new NotFoundException('Movie not found')
      const hall = await this.hallModel.findById(body.hallId).session(session)
      if (!hall) throw new NotFoundException('Hall not found')

      const start = body.startTime ? new Date(body.startTime) : screening.startTime
      const duration = movie.duration * 60 * 1000
      const breakInMs = 20 * 60 * 1000
      const end = new Date(start.getTime() + duration + breakInMs)

      const overlap = await this.screeningModel.findOne({
        _id: { $ne: screening._id },
        hallId: new Types.ObjectId(body.hallId),
        startTime: { $lt: end },
        endTime: { $gt: start }
      }).session(session)
      if (overlap) {
        throw new BadRequestException(`Hall is busy during this time: ${overlap.startTime.toUTCString()} - ${overlap.endTime.toUTCString()}`)
      }

      screening.movieId = movie._id
      screening.hallId = hall._id
      screening.startTime = start
      screening.endTime = end
      if (body.price) {
        screening.price = body.price
      }

      await screening.save({ session })
      await session.commitTransaction()
      return screening
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  async deleteOne(id: string) {
    const session = await this.screeningModel.db.startSession()
    session.startTransaction()
    try {
      const screening = await this.screeningModel.findById(id).session(session)
      if (!screening) {
        throw new NotFoundException("Screening not found")
      }
      // const hasBookings = await this.bookingModel.exists({
      //   screeningId: screening._id
      // })
      // if (hasBookings) {
      //   throw new BadRequestException('Cannot delete screening with existing bookings')
      // }
      // await this.screeningModel.deleteOne({ _id: id }).session(session)
      await session.commitTransaction()
      return screening
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }
}
