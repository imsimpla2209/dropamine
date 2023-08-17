import { ideasExcel } from '../controllers/data.controller'
import express from 'express'
import { authProtect, authorize } from '../middlewares/auth'


export const dataRouter = express.Router()

dataRouter.get('/ideasExcel', ideasExcel)