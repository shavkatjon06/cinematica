import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Movie, MovieSchema } from "../schemas/movie.schema";
import { Hall, HallSchema } from "../schemas/hall.schema";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                uri: configService.getOrThrow('MONGODB_URL')
            }),
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([
            { name: Movie.name, schema: MovieSchema },
            { name: Hall.name, schema: HallSchema }
        ]),
    ],
})
export class ScriptModule { }