export function random () {
  return Math.random()
}

export function deepCopy (data) {
  let json = JSON.stringify(data)
  if (json.length > 300) {
    console.warn('deep copying huge data', data, new Error())
  }
  return JSON.parse(json)
}
