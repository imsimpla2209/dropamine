import express from 'express'
import { authorize, authProtect } from '../middlewares/auth'
import Category from '../models/Category'
import { io } from '../utils/socket'

export const updateIdeaNumberRealTime = async () => {
  const now = new Date()
  const totalEventAvailable = await Category.find({ firstCloseDate: { $gt: now } })
  io.emit('total_event_available', { total: totalEventAvailable.length })
}

export const categoryRouter = express.Router()

categoryRouter.get('/', authProtect, async (req, res) => {
  try {
    const { id } = req.query
    const data = await Category.find(id ? { _id: id } : {})
    res.status(200).json({ success: 1, data })
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
})

categoryRouter.post('/', authProtect, authorize(['manager']), express.json(), async (req, res) => {
  // specialEventRouter.post('/', authProtect, authorize(['admin']), express.json(), async (req, res) => {
  try {
    const { _id, name } = req.body
    if (_id) {
      await Category.findOneAndUpdate(
        { _id },
        {
          name,
        },
        { upsert: true, timestamps: true }
      )
    } else {
      await Category.collection.insertOne({
        users: [],
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
    res.status(200).json({ success: 1 })
    updateIdeaNumberRealTime()
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
})

categoryRouter.delete('/:id', authProtect, authorize(['manager']), express.json(), async (req, res) => {
  try {
    const eventId = req.params.id
    await Category.findByIdAndDelete(eventId)
    updateIdeaNumberRealTime()

    res.status(200).json({ success: 1 })
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
})
