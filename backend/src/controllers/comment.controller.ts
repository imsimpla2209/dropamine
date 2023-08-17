import Comment from '../models/Comment'
import Idea from '../models/Idea'
import User from '../models/User'
import ApiErrorResponse from '../utils/ApiErrorResponse'
import { sendNotification } from '../utils/mailer'
import { io } from '../utils/socket'

export const createComment = async (req: any, res: any, next: any) => {
  try {
    const commentBody = req.body

    if (
      !commentBody.content ||
      commentBody.content == '' ||
      req.payload?.user?.id == '' ||
      commentBody.ideaId === '' ||
      commentBody.publisherEmail === ''
    ) {
      return next(new ApiErrorResponse('Lack of required information.', 400))
    }

    let idea = await Idea.findById(commentBody.ideaId).select('createdAt comments specialEvent')
    if (idea?.specialEvent) {
      idea = await idea.populate({
        path: 'specialEvent',
        select: ['finalCloseDate'],
      })
      if (new Date(idea.specialEvent.finalCloseDate) <= new Date()) {
        return next(new ApiErrorResponse(`This idea reached final closure date, idea id: ${commentBody.ideaId}`, 400))
      }
    }

    const data = { content: commentBody.content, ideaId: commentBody.ideaId, isAnonymous: commentBody.isAnonymous }
    const newComment = { ...data, userId: req.payload?.user?.id }
    let savedComment = await Comment.create(newComment)

    const user = await User.findById(req.payload?.user?.id).select('comments name email avatar role')
    user.comments.push(savedComment._id)
    idea.comments.push(savedComment._id)
    user.save()
    idea.save()
    savedComment.userId = user

    console.log(savedComment)

    io.emit('comments', { action: 'create', ideaId: commentBody.ideaId, comment: savedComment })
    if (commentBody.publisherEmail != 'None') {
      activeMailer(user.name, commentBody.publisherEmail, new Date(), idea._id)
        .then(data => console.log('isSent', data))
        .catch(error => console.log('error', error))
    }
    res.status(200).json({
      success: true,
      message: 'Comment is created successfully',
      Comment: savedComment,
    })
  } catch (err) {
    return next(new ApiErrorResponse(`${err.message}`, 500))
  }
}

export const activeMailer = async (name: any, email: any, date: any, ideaId: any) => {
  try {
    const title = 'Your idea has received a new comment'
    const content = `${name} has commented on your idea, commented at ${new Date(
      date
    ).toUTCString()}.  Check now by click the link bellow`
    const url = `https://main--leaks-app.netlify.app/staff/idea?id=${ideaId}`
    const isSent = await sendNotification(email, content, title, date, url)
    console.log(isSent)
    if (isSent.status === 400) {
      return new ApiErrorResponse(
        `Send Email Failed, status code: ${isSent.status}, \nData: ${isSent.response} \n`,
        500
      )
    }
    return isSent
  } catch (err) {
    return new ApiErrorResponse(`${err.message}`, 500)
  }
}

export const getComments = async (req: any, res: any, next: any) => {
  try {
    const reqQuery = req.query
    const { ideaId } = reqQuery
    const trending = reqQuery.tab || null
    const results = {}

    let options: any = { ideaId: ideaId }

    let comments = Comment.find(options).populate({
      path: 'userId',
      select: ['name', 'avatar', 'email', 'role'],
    })

    if (trending == 'best') {
      comments.sort({ like: -1 })
    } else {
      comments.sort({ date: -1 })
    }
    if (trending == 'oldest') {
      comments.sort({ date: 1 })
    } else {
      comments.sort({ date: -1 })
    }

    results['results'] = await comments
      // .limit(5)
      // .skip(offset)
      .exec()

    res.status(200).json({
      success: true,
      count: results['results'].length,
      data: results['results'],
    })
  } catch (err) {
    return next(new ApiErrorResponse(`${err.message}`, 500))
  }
}

export const getAllCommentsOfUser = async (req: any, res: any, next: any) => {
  try {
    const option = req.query.uid
    const userId = option == 'me' ? req.payload.user.id : option

    const user = await User.findById(userId)
    if (!user) {
      return next(new ApiErrorResponse(`Not found user id ${userId}`, 500))
    }
    const comments = await Comment.find({ publisherId: { $in: user._id } })
      .populate({
        path: 'userId',
        select: ['name', 'avatar', 'email', 'role'],
      })
      .populate('categories')
    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    })
  } catch (err) {
    return next(new ApiErrorResponse(`${err.message}`, 500))
  }
}

export const deleteComment = async (req: any, res: any, next: any) => {
  try {
    const { commentId } = req.params

    const deletedComment = await Comment.findByIdAndDelete(commentId)
    if (!deletedComment) {
      return next(new ApiErrorResponse(`Comment id ${commentId} not found`, 404))
    }

    const user = await User.findById(deletedComment.userId)
    const idea = await Idea.findById(deletedComment.ideaId)
    // await User.deleteMany({ CommentId: deletedComment._id });

    const newUserComments = user.comments.filter(userI => userI._id.toString() !== deletedComment._id)
    const newIdeaComment = idea.comments.filter(userC => userC._id.toString() !== deletedComment._id)

    user.comments = newUserComments
    idea.comments = newIdeaComment
    user.save()
    idea.save()

    res.status(200).json({ success: true, message: 'Comment is deleted!', deletedComment: deletedComment, user })
  } catch (error) {
    return next(new ApiErrorResponse(`${error.message}`, 500))
  }
}

export const editComment = async (req: any, res: any, next: any) => {
  try {
    //init req body obj
    const reqBody = req.body

    //get Comment id from req params prop
    const { CommentId } = req.params

    //update Comment with req body obj
    const updatedComment = await Comment.findByIdAndUpdate(CommentId, reqBody, { new: true, useFindAndModify: false })
      .populate('userId')
      .populate({
        path: 'comments',
        populate: {
          path: 'userId',
        },
      })
      .populate('likes')

    if (!updatedComment) {
      return next(new ApiErrorResponse(`Not found Comment id ${CommentId}`, 404))
    }

    await updatedComment.save()

    res.status(202).json({ message: 'Comment succesfully updated!', updatedComment })
  } catch (error) {
    return next(new ApiErrorResponse(`${error.message}`, 500))
  }
}

export const likeComment = async (req: any, res: any, next: any) => {
  try {
    const { commentId } = req.params
    let comment = await Comment.findById(commentId)
    comment.like = +comment.like + 1
    await comment.save()
    res.status(200).json({ success: true, message: 'Comment liked!', comment })
  } catch (error) {
    return next(new ApiErrorResponse(`${error.message}`, 500))
  }
}

export const disLikeComment = async (req: any, res: any, next: any) => {
  try {
    const { commentId } = req.params
    let comment = await Comment.findById(commentId)
    comment.like = +comment.like - 1
    await comment.save()
    res.status(200).json({ success: true, message: 'Comment liked!', comment })
  } catch (error) {
    return next(new ApiErrorResponse(`${error.message}`, 500))
  }
}
