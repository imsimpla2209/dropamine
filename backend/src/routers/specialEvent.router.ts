import express from 'express'
import SpecialEvent from '../models/SpecialEvent'
import { io } from '../utils/socket'
import { authorize, authProtect } from '../middlewares/auth'

export const updateEventNumberRealTime = async () => {
  const now = new Date()
  const totalEventAvailable = await SpecialEvent.find({ firstCloseDate: { $gt: now } })
  const data = await SpecialEvent.find({})

  io.emit('all_events', { totalAvailable: totalEventAvailable.length, allEvents: data })
}

export const specialEventRouter = express.Router()

specialEventRouter.get('/', authProtect, async (req, res) => {
  try {
    const { id } = req.query
    const data = await SpecialEvent.find(id ? { _id: id } : {})
    res.status(200).json({ success: 1, data })
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
})

specialEventRouter.get('/available', authProtect, async (req, res) => {
  try {
    const now = new Date()
    const data = await SpecialEvent.find({ firstCloseDate: { $gt: now } })
    res.status(200).json({ success: 1, data })
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
})

specialEventRouter.post('/', authProtect, authorize(['admin']), express.json(), async (req, res) => {
  // specialEventRouter.post('/', authProtect, authorize(['admin']), express.json(), async (req, res) => {
  try {
    const { _id, title, description, startDate, firstCloseDate, finalCloseDate } = req.body
    if (_id) {
      await SpecialEvent.findOneAndUpdate(
        { _id },
        {
          title,
          description,
          startDate: new Date(startDate),
          firstCloseDate: new Date(firstCloseDate),
          finalCloseDate: new Date(finalCloseDate),
        },
        { upsert: true, timestamps: true }
      )
    } else {
      await SpecialEvent.collection.insertOne({
        title,
        description,
        startDate: new Date(startDate),
        firstCloseDate: new Date(firstCloseDate),
        finalCloseDate: new Date(finalCloseDate),
      })
    }
    updateEventNumberRealTime()

    res.status(200).json({ success: 1 })
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
})

specialEventRouter.delete('/:id', authProtect, authorize(['admin']), express.json(), async (req, res) => {
  try {
    const eventId = req.params.id
    await SpecialEvent.findByIdAndDelete(eventId)
    updateEventNumberRealTime()

    res.status(200).json({ success: 1 })
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
})
