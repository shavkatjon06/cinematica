import { Model, Mongoose } from 'mongoose'
import { HallDocument } from '../../schemas/hall.schema'
import { halls } from '../../assets/halls'

export const run = async (deps: { hallModel: Model<HallDocument> }) => {
    console.log('▶ Running 02.halls.script')

    await deps.hallModel.deleteMany({})
    await deps.hallModel.insertMany(halls)

    console.log('✅ 02.halls.script done')
}