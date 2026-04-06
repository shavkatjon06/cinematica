import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ForgotPasswordDocument = ForgotPassword & Document

@Schema({
    collection: 'forgot-passwords',
    timestamps: true
})
export class ForgotPassword {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId

    @Prop({ required: true })
    token: string
}

export const ForgotPasswordSchema = SchemaFactory.createForClass(ForgotPassword)