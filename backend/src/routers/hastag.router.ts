import Hastag from "../models/Hastag";
import express from 'express'
import { io } from '../utils/socket'
import { authorize, authProtect } from '../middlewares/auth'


export const updateIdeaNumberRealTime = async () => {
  const now = new Date()
  const totalEventAvailable = await Hastag.find({ firstCloseDate: { $gt: now } })
  io.emit('total_event_available', { total: totalEventAvailable.length })
}

export const hastagRouter = express.Router()


hastagRouter.post('/:id', authProtect, express.json(), async (req, res) => {
  try {
    const HastagId = req.params.id
    await Hastag.findByIdAndDelete(HastagId)
    updateIdeaNumberRealTime()

    res.status(200).json({ success: 1 })
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
})

hastagRouter.post('/', authProtect, express.json(), async (req, res) => {
  try {
    const { _id, name } = req.body
    let result
    if (_id) {
      result = await Hastag.findOneAndUpdate(
        { _id },
        {
          name,
        },
        { upsert: true, timestamps: true }
      )
    } else {
      result = await Hastag.create({
        ideas: [],
        name,
      })
    }
    res.status(200).json({ success: 1, data: result })
    updateIdeaNumberRealTime()
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
})

hastagRouter.get('/', async (req, res) => {
  try {
    const { id } = req.query
    const data = await Hastag.find(id ? { _id: id } : {})
    res.status(200).json({ success: 1, data })
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
})

