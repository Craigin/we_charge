
const randomStringChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
import Cookies from 'cookie'

export function randomString (len = 8) {
  let chars = []
  for (let i = 0; i < len; i++) {
    let index = Math.floor(Math.random() * randomStringChars.length)
    let c = randomStringChars.charAt(index)
    chars.push(c)
  }
  return chars.join('')
}

export function formatNumber (num) {
  if (num === undefined || num === null) {
    return
  }
  let splits = num.toString().split('.')
  let value = splits[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  if (splits[1]) {
    value += '.' + splits[1]
  }
  return value
}

export function splitStringToArray (str = '') {
  return str.split(/[,;]/).filter(item => item)
}

export function isHttpUrl (url) {
  return typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://'))
}

function traverseChildren (parent, callback, options = {}) {
  let {childrenKey = 'children'} = options
  let {[childrenKey]: children} = parent
  if (!children) {
    return
  }

  for (let i = 0; i < children.length; i++) {
    let child = children[i]
    let result = callback(child, parent)
    if (result) {
      let {stop, skipChildren} = result
      if (stop) {
        return result
      }
      if (skipChildren) {
        continue
      }
    }

    result = traverseChildren(child, callback, options)
    if (result) {
      let {stop} = result
      if (stop) {
        return result
      }
    }
  }
}

export function traverseTree (root, callback, options = {}) {
  let {childrenKey = 'children'} = options
  let children = Array.isArray(root) ? root : [root]
  traverseChildren({[childrenKey]: children}, callback, options)
}

export function getTreeNode (root, value, options = {}) {
  let {childrenKey = 'children', matchKey = 'id', match} = options
  let children = Array.isArray(root) ? root : root[childrenKey]
  if (!children) {
    return
  }

  let skip = new Set()
  // current depth
  for (let i = 0; i < children.length; i++) {
    let child = children[i]
    let nodeValue = child[matchKey]
    if (typeof match === 'function') {
      let result = match(nodeValue, value)
      if (result === true) {
        return child
      }
      if (result) {
        let {skipChildren} = result
        if (skipChildren) {
          skip.add(i)
        }
      }
    } else {
      if (nodeValue === value) {
        return child
      }
    }
  }

  // depth deeper
  for (let i = 0; i < children.length; i++) {
    if (skip.has(i)) {
      continue
    }
    let child = children[i]
    let found = getTreeNode(child, value, options)
    if (found) {
      return found
    }
  }
}
export function checkCreateSectorPrivilege (supervisor, createSector) {
  let {
    sectors = [],
    highPrivilege = false
  } = supervisor

  if (highPrivilege) {
    return true
  }

  return sectors.indexOf(createSector) > -1
}

export function getSectorPrivilegeWhere (supervisor, schema, where, selectedSectors) {
  let {
    sectors = [],
    highPrivilege = false
  } = supervisor
  let {
    hasSector = false
  } = schema

  if (selectedSectors) {
    sectors = sectors.filter(item => selectedSectors.indexOf(item) > -1)
  }

  if (highPrivilege) {
    return where
  }

  if (hasSector) {
    where = {
      ...where,
      sector: {
        $in: sectors
      }
    }
  }
  return where
}

export function getCookieSectorPrivilegeWhere (ctx, schema, where) {
  let {
    $session: {
      supervisor: {
        sectors = [],
        highPrivilege = false
      }
    },
    request: {
      headers: {
        cookie
      }
    }
  } = ctx

  let {
    sector: cookieSector = ''
  } = Cookies.parse(cookie)

  let {
    hasSector = false
  } = schema

  sectors = sectors.filter(item => splitStringToArray(cookieSector).indexOf(item) > -1)

  if (highPrivilege) {
    return where
  }

  if (hasSector) {
    where = {
      ...where,
      sector: {
        $in: sectors
      }
    }
  }
  return where
}

export function checkPrivilege (supervisor, required, def = true) {
  let {
    sectors = [],
    roles = [],
    highPrivilege = false
  } = supervisor

  if (required === false) {
    return false
  }
  if (required === true) {
    return true
  }
  if (required === undefined) {
    return def
  }

  if (highPrivilege) {
    return true
  }

  let {
    sectors: requiredSectors,
    roles: requiredRoles
  } = required

  let sectorMatch = requiredSectors ? requiredSectors.find(r => sectors.indexOf(r) >= 0) : true
  let roleMatch = requiredRoles ? requiredRoles.find(r => roles.indexOf(r) >= 0) : true

  return sectorMatch && roleMatch
}

export function dumpPrivilege (supervisor, required) {
  let {
    sectors,
    roles,
    highPrivilege
  } = supervisor
  return `required: ${JSON.stringify(required)}, supervisor: ${JSON.stringify({sectors, roles, highPrivilege})}`
}
export function checkRole (requiredRoles, {roles = [], highPrivilege = false}, def = true) {
  if (requiredRoles === false) {
    return false
  }
  if (requiredRoles === true) {
    return true
  }
  if (requiredRoles === undefined) {
    return def
  }
  if (highPrivilege) {
    return true
  }

  return requiredRoles.find(r => roles.indexOf(r) >= 0)
}

export function logError (err) {
  let {
    response: {
      data: {
        data
      } = {}
    } = {}
  } = err
  console.error(err)
  if (data) {
    console.log('error response body', data)
    let {
      error: {
        root_cause: rootCause
      } = {}
    } = data
    if (rootCause) {
      console.log('error root cause', rootCause)
    }
  }

  err.status = 400
  err.expose = true
}

export function concurrencyLimit (getPromise, items, limit = 10) {
  return new Promise((resolve, reject) => {
    let result = []
    let total = items.length
    let finished = 0
    let running = 0
    let index = 0
    let next = () => {
      if (finished >= total) {
        resolve(result)
        return
      }

      if (running >= limit || index >= total) {
        return
      }

      let index1 = index
      let item = items[index1]
      index += 1

      running += 1
      getPromise(item).then(data => {
        result[index1] = data
        running -= 1
        finished += 1
        next()
      }).catch(err => {
        running -= 1
        reject(err)
      })

      next()
    }

    next()
  })
}
