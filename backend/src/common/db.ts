import mongoose from 'mongoose'

const initiateMongoServer = async (MONGO_URL: string): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URL)
    console.log('Connected to DB !!')
  } catch (e) {
    console.log(`Cannot connect to DB!!, log:`, e)
    throw e
  }
}
export default initiateMongoServer
