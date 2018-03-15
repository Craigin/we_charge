import mongoose from 'mongoose'

export function exportDatabases (config) {
  let db = {}
  for (let name in config) {
    let connection = mongoose.createConnection(config[name], {
      config: {
        autoIndex: false
      },
      server: {
        reconnectTries: Number.MAX_VALUE
      }
    })
    db[name] = connection.db
  }
  return db
}
