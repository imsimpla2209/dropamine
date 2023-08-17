import * as dotenv from 'dotenv'
import * as path from 'path'

export async function ReadConfig() {
  dotenv.config()
  const resolvedir = (dir: string) => (dir ? path.resolve(process.cwd(), dir) : undefined)
  const config = {
    server: {
      port: process.env.PORT || 9000,
    },
    database: {
      db_url: process.env.DB_URL,
      db_name: process.env.DB_NAME,
    },
    app: {
      dir: resolvedir('../frontend/build'),
    },
    sib: {
      key: process.env.SIB_API_KEY
    }
  }
  Object.defineProperty(config.database, 'db_url', {
    enumerable: false,
  })
  return config
}
