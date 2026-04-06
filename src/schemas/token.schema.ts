import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type TokenDocument = Token & Document

@Schema({
    collection: 'tokens',
    timestamps: true
})
export class Token {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId

    @Prop({ required: true })
    refreshToken: string
}

export const TokenSchema = SchemaFactory.createForClass(Token)