import { Module } from "@nestjs/common";
import { TokenService } from "./token.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Token, TokenSchema } from "src/schemas/token.schema";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forFeature([
            { name: Token.name, schema: TokenSchema },
        ]),
        JwtModule.register({
            secret: process.env.JWT_ACCESS_SECRET,
            signOptions: { expiresIn: '1h' }
        })
    ],
    providers: [TokenService],
    exports: [TokenService]
})

export class TokenModule { }