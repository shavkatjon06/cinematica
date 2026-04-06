import { NestFactory } from '@nestjs/core'
import { getModelToken } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Movie } from '../schemas/movie.schema'
import { Hall } from '../schemas/hall.schema'
import { run as runMovies } from './scripts/01.movies.script'
import { run as runHalls } from './scripts/02.halls.script'
import { ScriptModule } from './db'

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(ScriptModule)
    const movieModel = app.get<Model<any>>(getModelToken(Movie.name))
    const hallModel = app.get<Model<any>>(getModelToken(Hall.name))

    const deps = {
        movieModel,
        hallModel
    }

    console.log('🚀 Running scripts...\n')

    await runMovies(deps)
    await runHalls(deps)

    console.log('\n🎉 All scripts finished')

    await app.close()
}

bootstrap()