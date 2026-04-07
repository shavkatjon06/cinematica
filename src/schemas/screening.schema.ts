import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Movie } from "./movie.schema";
import { Hall } from "./hall.schema";

export type ScreeningDocument = Screening & Document

@Schema()
class Seat {
    @Prop({ required: true })
    seatNumber: string

    @Prop({
        required: true,
        enum: ['reserved', 'booked'],
        default: 'reserved'
    })
    status: 'reserved' | 'booked'

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId?: Types.ObjectId
}

const SeatSchema = SchemaFactory.createForClass(Seat)

@Schema({
    collection: 'screenings',
    timestamps: true,
})
export class Screening {
    @Prop({ type: Types.ObjectId, ref: Movie.name, required: true })
    movieId: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: Hall.name, required: true })
    hallId: Types.ObjectId

    @Prop({ required: true })
    startTime: Date

    @Prop({ required: true })
    endTime: Date

    @Prop({ type: { standard: { type: Number }, comfort: { type: Number } }, required: true })
    price: {
        standard: number
        comfort: number
    }

    @Prop({ type: [SeatSchema], default: [] })
    bookedSeats: Seat[]
}

export const ScreeningSchema = SchemaFactory.createForClass(Screening)