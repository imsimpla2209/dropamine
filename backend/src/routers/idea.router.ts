import express from 'express'
import {
  createIdea,
  deleteIdea,
  disLikeIdea,
  editIdea,
  getAllIdeasByCategory,
  getAllIdeasByDepartment,
  getAllIdeasOfUser,
  getDataSuggestion,
  getIdea,
  getIdeas,
  getIdeasByManager,
  getPostLikes,
  getTotalIdea,
  ideaTotalByDuration,
  likeIdea,
  omitVoteIdea,
} from '../controllers/idea.controller'
import { downloadFiles, getPresignedUrl } from '../controllers/upload.controller'
import { authorize, authProtect } from '../middlewares/auth'

export const ideaRouter = express.Router()

ideaRouter.get('/', authProtect, getIdeas)
ideaRouter.get('/manager', authProtect, authorize(['manager']), getIdeasByManager)
ideaRouter.get('/suggest', authProtect, getDataSuggestion)
ideaRouter.get('/ideasOfUser', authProtect, getAllIdeasOfUser)
ideaRouter.get('/ideasByCategory', authProtect, getAllIdeasByCategory)
ideaRouter.get('/ideasByDepartment', authProtect, getAllIdeasByDepartment)
ideaRouter.get('/preSignUrl', authProtect, getPresignedUrl)
ideaRouter.get('/detail', authProtect, getIdea)
ideaRouter.get('/ideaLikes', authProtect, getPostLikes)
ideaRouter.get('/downloadFiles', authProtect, downloadFiles)
ideaRouter.get('/totalIdea', authProtect, getTotalIdea)
ideaRouter.get('/ideaTotalByDuration', authProtect, ideaTotalByDuration)
ideaRouter.post('/create', authProtect, authorize(['staff']), createIdea)
ideaRouter.put('/dislike', authProtect, disLikeIdea)
ideaRouter.put('/like', authProtect, likeIdea)
ideaRouter.put('/omitVote', authProtect, omitVoteIdea)
ideaRouter.put('/edit/:ideaId', authProtect, editIdea)
ideaRouter.delete('/delete/:ideaId', authProtect, deleteIdea)
