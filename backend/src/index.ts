import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import http from 'http'
import { createSocketIO } from './utils/socket'
import initiateMongoServer from './common/db'
import { ReadConfig } from './config'
import User from './models/User'
import router from './routers/api'

async function main() {
  const config = await ReadConfig()
  await initiateMongoServer(config.database.db_url!)

  const app = express()

  app.use(express.json())
  app.use(cookieParser())
  app.disable('x-powered-by')
  app.use(cors())
  router(app)
  console.log(`listen on ${config.server.port}`)
  await User.seedAdmin() // clone code ve xoa het account trong mongo de tao tk admin
  // khi tai khoan admin dc tao roi thi comment dong ben tren vao. tk: admin, mk: admin

  let server = http.createServer(app)

  createSocketIO(server)

  server.listen(Number(config.server.port), '0.0.0.0', () => {
    const err = arguments[0]
    if (err) {
      console.error(err)
    }
  })
}
main().catch(err => console.error(`Cannot init server!, log: `, err))
