import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document

@Schema({
    collection: 'users',
    timestamps: true
})
export class User {
    @Prop()
    name: string

    @Prop({ required: true, unique: true })
    email: string

    @Prop({ required: true })
    password: string

    @Prop({ default: false })
    isVerified: boolean

    @Prop({ type: String, default: "" })
    verificationCode: string
}

export const UserSchema = SchemaFactory.createForClass(User)