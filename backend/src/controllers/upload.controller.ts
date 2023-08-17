import archiver from 'archiver'
import AWS from 'aws-sdk'
import { PassThrough } from 'stream'
import { v4 as uuidv4 } from 'uuid'
import Idea from '../models/Idea'
import ApiErrorResponse from '../utils/ApiErrorResponse'
// const config = {
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
//   region: "us-east-1",
// };
const initS3AWS = () => {
  const accesskeyId = process.env.AWS_S3_ACCESS_KEY
  const secretAccessKey = process.env.AWS_S3_SECRET_KEY
  const config = {
    credentials: {
      accessKeyId: accesskeyId,
      secretAccessKey: secretAccessKey,
    },
    region: 'ap-northeast-1',
  }

  const s3 = new AWS.S3(config)
  s3.config.update(config)

  return s3
}

export const getPresignedUrl = (req: any, res: any, next: any) => {
  const s3 = initS3AWS()
  const extension = req.query.ext
  const type = req.query.type
  const key = `${req.payload.user.id}/${uuidv4()}.${req.query.ext}`

  s3.getSignedUrl(
    'putObject',
    {
      Bucket: 'yessir-bucket-tqt',
      Key: key,
      ContentType: type,
      // Conditions: [
      //   ['content-length-range', 0, 10000000],
        // ['starts-with', '$Content-Type', 'image/'],
      //   ['eq', '$Content-Type', type],
      // ],
      Expires: 15,
    },
    (err, url) => {
      if (!err) {
        return res.status(200).json({
          key: key,
          url: url,
        })
      }
      return next(new ApiErrorResponse(`cannot call for presigned url, ${err.message}`, 500))
    }
  )
}

const multiFilesStream = fileKeys => {
  const archive = archiver('zip', { zlib: { level: 5 } })
  const s3 = initS3AWS()
  for (const element of fileKeys) {
    const realKey = element.slice(element.lastIndexOf('/') - 24)
    console.log(realKey)
    const passthrough = new PassThrough()
    s3.getObject({
      Bucket: 'yessir-bucket-tqt',
      Key: realKey,
    })
      .createReadStream()
      .pipe(passthrough)
    archive.append(passthrough, { name: realKey })
  }
  return archive
}

export const downloadFiles = async (req: any, res: any, next: any) => {
  try {
    const ideaId = req.query.id
    const idea = await Idea.findById(ideaId)
    if (!idea) {
      return next(new ApiErrorResponse(`Not found idea id ${ideaId}`, 404))
    }
    if (!idea?.files) {
      return next(new ApiErrorResponse(`Idea id ${ideaId} does not have files`, 400))
    }
    const mfstream = multiFilesStream(idea?.files)
    mfstream.pipe(res)
    mfstream.finalize()
  } catch (err) {
    return next(new ApiErrorResponse(`${err.message}`, 500))
  }
}


