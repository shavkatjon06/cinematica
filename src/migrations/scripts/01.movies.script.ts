import { Model } from 'mongoose'
import { MovieDocument } from '../../schemas/movie.schema'
import { data } from '../../assets/movies'

export const run = async (deps: { movieModel: Model<MovieDocument> }) => {
    console.log('▶ Running 01.movies.script')

    await deps.movieModel.deleteMany({})
    await deps.movieModel.insertMany(data)

    console.log('✅ 01.movies.script done')
}