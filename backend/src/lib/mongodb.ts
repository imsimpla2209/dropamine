import { io } from '../utils/socket'

const { MongoClient, Db } = require('mongodb')

async function Connect(url) {
  const client = new MongoClient(url)
  await client.connect()
  return client
}

const CaculatePerCent = number => (number * 100).toFixed(2)

/**
 * @param {Db} db
 * @param {string} collectionName
 * @returns {Promise<boolean>}
 */
async function CheckCollectionExist(db, collectionName) {
  const collections = await Promise.all((await db.listCollections().toArray()).map(el => el.name))
  return collections.includes(collectionName)
}

/**
 * @param {Db} db1
 * @param {Db} db2
 * @returns {number}
 */
async function Process(db1, db2) {
  const collections = await Promise.all((await db1.listCollections().toArray()).map(el => el.name))
  let total = +0
  let totalCollections = collections?.length

  for (let i = 0; i < collections.length; i++) {
    const col = await db1.collection(collections[i])
    const docs = await col.find().toArray()
    const col_backup = await db2.collection(collections[i])
    if (await CheckCollectionExist(db2, collections[i])) {
      await col_backup.drop()
    }
    let count = +0
    try {
      for (let d of docs) {
        await col_backup.insertOne(d)
        count++
        console.clear()
        console.log(`Copy ${count}/${docs.length} documents (${CaculatePerCent(count / docs.length)}%)...`)
      }
    } catch (err) {
      throw err
    }
    total += count
    console.clear()
    console.log(`Copy collection ${collections[i]} done...`)

    io.emit('backup', { total: totalCollections, progress: i + 1 })
  }
  return total
}

module.exports = {
  Connect,
  Process,
}
