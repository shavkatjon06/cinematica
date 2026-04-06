import { NestFactory } from '@nestjs/core'
import { getModelToken } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Movie } from '../schemas/movie.schema'
import { run as runMovies } from './scripts/01.movies.script'
import { ScriptModule } from './db'

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(ScriptModule)
    const movieModel = app.get<Model<any>>(getModelToken(Movie.name))

    const deps = {
        movieModel,
    }

    console.log('🚀 Running scripts...\n')

    await runMovies(deps)

    console.log('\n🎉 All scripts finished')

    await app.close()
}

bootstrap()