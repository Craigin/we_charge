child_process = require('child_process')
let p = child_process.spawn('tail', [ '-f', '-n', 10,  `/Users/kevin/*.txt`], {
})

// let p = child_process.spawn('ssh', ['kevin@localhost', 'tail','-f', '-n', 10, '/Users/kevin/*.txt'])

p.stderr.on('data', (err) => {
  console.log('fail', err.toString())
})


p.stdout.on('data', (err) => {
  console.log('ok', err.toString())
})
