import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type HallDocument = Hall & Document

@Schema()
class Row {
    @Prop({ required: true })
    name: string

    @Prop({ required: true, enum: ['standard', 'comfort'], default: 'standard' })
    type: 'standard' | 'comfort'

    @Prop({ required: true })
    seats: number
}

const RowSchema = SchemaFactory.createForClass(Row)

@Schema({
    collection: "halls",
    timestamps: true
})
export class Hall {
    @Prop({ required: true })
    name: string

    @Prop({ required: true, type: [RowSchema] })
    rows: Row[]
}

export const HallSchema = SchemaFactory.createForClass(Hall)