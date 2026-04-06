import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type MovieDocument = Movie & Document

@Schema({
    collection: 'movies',
    timestamps: true
})
export class Movie {
    @Prop({ required: true })
    title: string

    @Prop({ required: true })
    description: string

    @Prop({ required: true })
    duration: number

    @Prop({ required: true })
    genre: string[]

    @Prop({ required: true })
    trailer: string

    @Prop({ required: true })
    ageRating: string
}

export const MovieSchema = SchemaFactory.createForClass(Movie)