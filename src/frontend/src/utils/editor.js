
function initEditor (options = {}) {
  let initCallbacks = []
  let initStatus = ''
  let initError

  let {
    id,
    variable,
    url,
    css
  } = options

  return () => {
    return new Promise((resolve, reject) => {
      let ace = window[variable]
      if (ace) {
        resolve(ace)
        return
      }
      if (initStatus === 'success') {
        console.warn('init success without ace, erh, wield...')
        reject()
        return
      }
      if (initStatus === 'error') {
        reject(initError)
        return
      }
      initCallbacks.push({
        resolve,
        reject
      })
      if (initStatus === 'loading') {
        return
      }
      initStatus = 'loading'
      let script = document.getElementById(id)
      if (script) {
        console.warn(`element ${id} already exists, erh, wield...`)
        reject()
        return
      }
      script = document.createElement('script')
      script.setAttribute('id', id)
      script.setAttribute('type', 'text/javascript')
      script.setAttribute('src', url)
      script.addEventListener('load', () => {
        initStatus = 'success'
        let ace = window[variable]
        initCallbacks.forEach(callback => callback.resolve(ace))
        initCallbacks = []

        if (css) {
          let link = document.createElement('link')
          link.setAttribute('rel', 'stylesheet')
          link.setAttribute('href', css)
          document.head.appendChild(link)
        }
      })
      script.addEventListener('error', err => {
        initStatus = 'error'
        initError = err
        console.error('ace init error', err)
        initCallbacks.forEach(callback => callback.reject(err))
        initCallbacks = []
      })
      document.body.appendChild(script)
    })
  }
}

let initAce = initEditor({
  id: 'xc-ace',
  variable: 'ace',
  url: 'https://cdn.bootcss.com/ace/1.2.8/ace.js'
})

let initJSONEditor = initEditor({
  id: 'xc-json-editor',
  variable: 'JSONEditor',
  url: 'https://cdn.bootcss.com/jsoneditor/5.9.5/jsoneditor.min.js',
  css: 'https://cdn.bootcss.com/jsoneditor/5.9.5/jsoneditor.min.css'
})

export function init () {
  return Promise.all([initAce(), initJSONEditor()]).then(result => {
    let [
      ace,
      JSONEditor
    ] = result
    return {
      ace,
      JSONEditor
    }
  })
}
