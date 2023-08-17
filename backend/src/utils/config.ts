require('dotenv').config()

async function ReadConfig() {
  const config = {
    database: {
      primary: {
        db_url: process.env.PRIMARY_DB,
        db_name: process.env.PDB_NAME,
      },
      slave: {
        db_url: process.env.SLAVE_DB,
        db_name: process.env.SDB_NAME + `-version-${new Date().getTime()}`,
      },
    },
  }
  return config
}

module.exports = ReadConfig
