import * as utils from './utils'

let mongo
export function setConfig(config) {
  mongo =  utils.exportDatabases(config)
}

export function getMongo () {
  return mongo
}

export function getCollection (database, collection, options = {}) {
  let _database = mongo[database]
  if (!_database) {
    throw new Error(`database ${database} not found`)
  }
  let _collection = _database.collection(collection)
  if (!_collection) {
    throw new Error(`collection ${database}.${collection} not found`)
  }
  return _collection
}
