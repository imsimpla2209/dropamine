const ReadConfig = require('./config')
const { Connect, Process } = require('../lib/mongodb')

export async function startBackup() {
  try {
    console.log('Backup tool start....')

    const log = console.log
    console.log = function (...args) {
      args.unshift(new Date())
      log.apply(console, args)
    }
    /**************************************************************************/
    const config = await ReadConfig()
    console.log(config)
    /**************************************************************************/
    const primary = await Connect(config.database.primary.db_url)
    const database = primary.db(config.database.primary.db_name)
    console.log(`Connect db primary....`)
    const slave = await Connect(config.database.slave.db_url)
    const backup_db = slave.db(config.database.slave.db_name)
    console.log(`Connect db slave....`)
    /**************************************************************************/
    const total = await Process(database, backup_db)
    console.log(`${total} documents backup done...`)
    await primary.close()
    await slave.close()
  } catch (err) {
    console.log(err)
  }
}
