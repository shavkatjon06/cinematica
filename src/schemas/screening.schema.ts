import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Movie } from "./movie.schema";
import { Hall } from "./hall.schema";

export type ScreeningDocument = Screening & Document

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
}

export const ScreeningSchema = SchemaFactory.createForClass(Screening)

ScreeningSchema.index(
    { hallId: 1, startTime: 1 },
    { unique: true }
);