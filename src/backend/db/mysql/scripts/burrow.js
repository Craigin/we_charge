'use strict'

const SequelizeAuto = require('sequelize-auto')

function exportDatabase (options) {
  if (typeof (options) === 'string') {
    options = {database: options}
  }
  let {host, port, database, username, password, output} = options
  return new Promise((resolve, reject) => {
    let config = {
      spaces: true,
      indentation: 2,
      directory: `./src/${output || database}`,

      dialect: 'mysql',
      host: host || 'localhost',
      port: port || 3306,
      additional: {
        freezeTableName: true,
        timestamps: false
      },
      tables: name => {
        let m = /^(.*)_([0-9]+)$/.exec(name)
        if (!m) {
          return name
        }
        if (/^0+$/.exec(m[2])) {
          return {
            name,
            rename: m[1]
          }
        }
      },
      presave: (name, text) => {
        return text
          .replace(/(module\.exports.*function.*DataTypes.*)(\))/, `$1, name='${name}'$2`)
          .replace(/(tableName:[ \t]*)['"][A-Za-z0-9_]+['"](,)/, `$1name$2`)
      }
    }

    let auto = new SequelizeAuto(database, username || 'root', password || '', config)
    auto.run(function (err) {
      if (err) {
        reject(err)
        return
      }

      resolve()
    })
  })
}

let args = process.argv.slice(2)

let databases = [
  'we_charge'
]
if (args.length) {
  databases = databases.filter(database => {
    let name = typeof database === 'string' ? database : database.database
    return args.indexOf(name) >= 0
  })
}
Promise.all(databases.map(exportDatabase)).then(() => {
}).catch(err => {
  console.error('error', err)
})
