import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type HallDocument = Hall & Document

@Schema()
class Row {
    @Prop({ required: true })
    name: string

    @Prop({ required: true, enum: ['standard', 'comfort'], default: 'standard' })
    type: 'standard' | 'comfort'
}

const RowSchema = SchemaFactory.createForClass(Row)

@Schema()
class Layout {
    @Prop({ required: true, type: [RowSchema] })
    rows: Row[]

    @Prop({ required: true })
    seatsPerRow: number
}

const LayoutSchema = SchemaFactory.createForClass(Layout)

@Schema({
    collection: "halls",
    timestamps: true
})
export class Hall {
    @Prop({ required: true })
    name: string

    @Prop({ required: true, type: LayoutSchema })
    layout: Layout
}

export const HallSchema = SchemaFactory.createForClass(Hall)