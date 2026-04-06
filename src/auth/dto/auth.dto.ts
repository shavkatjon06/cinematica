import { IsNotEmpty, IsString } from "class-validator";

export class AuthDto {
    @IsString()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    password: string
}

export class VerifyDto {
    @IsString()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    verificationCode: string
}