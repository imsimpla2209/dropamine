import Idea from '../models/Idea'
import ApiErrorResponse from '../utils/ApiErrorResponse'
import excel from 'exceljs'
import Category from '../models/Category'

export const ideasExcel = async (req: any, res: any, next: any) => {
  try {
    const options = req?.query
    let queryOpts = {}
    if (options?.cateId) {
      const category = await Category.findById(options?.cateId)
      if (!category) {
        return next(new ApiErrorResponse(`Not found category id ${options?.cateId}`, 500))
      }
      queryOpts = { categories: { $in: [options.cateId] } }
    }
    if (req?.query.from) {
      const dateOptions = req.query
      queryOpts = Object.assign({}, queryOpts, {
        createdAt: {
          $gte: new Date(dateOptions.from),
          $lt: new Date(dateOptions.to),
        },
      })
    }
    console.log(queryOpts)
    const ideas = await Idea.find(queryOpts)
      .populate({
        path: 'publisherId',
        select: ['name', 'department'],
        populate: {
          path: 'department',
          select: ['name'],
        },
      })
      .populate({
        path: 'specialEvent',
        select: ['title'],
      })
      .populate({
        path: 'categories',
        select: ['name'],
      })

    if (!ideas[0]) {
      return res.status(202).json({ message: `No data match your demand!!!` })
    }

    let ideaRows = []
    ideas.forEach(idea => {
      ideaRows.push({
        id: idea?.id,
        title: idea?.title,
        publisher: idea?.publisherId?.name,
        date: idea?.createdAt,
        category: '' + idea?.categories?.map(cate => cate.name),
        votesCount: idea?.meta?.likesCount - idea?.meta?.dislikesCount,
        comment: idea?.comments?.length,
        views: idea?.meta?.views,
        specialEvent: idea?.specialEvent?.title,
        department: idea?.publisherId?.department?.name,
        files: idea?.files,
      })
    })

    let workbook = new excel.Workbook()
    let worksheet = workbook.addWorksheet('Ideas')

    worksheet.columns = [
      { header: 'Id', key: 'id', width: 20 },
      { header: 'Title', key: 'title', width: 40 },
      { header: 'Publisher', key: 'publisher', width: 20 },
      { header: 'Date', key: 'date', width: 10 },
      { header: 'Categories', key: 'category', width: 30 },
      { header: 'Total votes', key: 'votesCount', width: 5 },
      { header: 'Total comments', key: 'comment', width: 5 },
      { header: 'Total views', key: 'views', width: 5 },
      { header: 'Special event', key: 'specialEvent', width: 35 },
      { header: 'Department', key: 'department', width: 15 },
      { header: 'Files attachment', key: 'files', width: 100 },
    ]
    worksheet.addRows(ideaRows)

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end()
    })
  } catch (err) {
    return next(new ApiErrorResponse(`${err.message}`, 500))
  }
}
