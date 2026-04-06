import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Token, TokenDocument } from "src/schemas/token.schema";

@Injectable()
export class TokenService {
    constructor(
        @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
        private jwtService: JwtService,
    ) { }

    generateToken(payload: any) {
        const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' })
        const refreshToken = this.jwtService.sign(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '30d' })
        return { accessToken, refreshToken }
    }

    async saveToken(userId: string, refreshToken: string) {
        const exist = await this.tokenModel.findOne({ userId })
        if (exist) {
            exist.refreshToken = refreshToken
            return exist.save()
        }
        return this.tokenModel.create({ userId, refreshToken })
    }

    async removeToken(refreshToken: string) {
        return this.tokenModel.findOneAndDelete({ refreshToken })
    }

    async findToken(refreshToken: string) {
        return this.tokenModel.findOne({ refreshToken })
    }

    validateRefreshToken(token: string) {
        try {
            return this.jwtService.verify(token, { secret: process.env.JWT_REFRESH_SECRET })
        } catch (error) {
            return null
        }
    }
}