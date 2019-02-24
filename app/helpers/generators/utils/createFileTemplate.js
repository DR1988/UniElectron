import fs from 'fs'
import mkdirp from 'mkdirp'
import path from 'path'

/* eslint-disable no-console */

function create(template, options, dest, filename) {
  if (!fs.existsSync(dest)) {
    mkdirp.sync(dest, (err) => {
      if (err) throw new Error(err)
      else console.info(`Created directory ${dest}`)
    })
  }

  let tmp = fs.readFileSync(path.join(__dirname, '../templates', template), 'utf-8')
  Object.keys(options).forEach((key) => {
    const reg = new RegExp(`{${key}}`, 'g')
    tmp = tmp.replace(reg, options[key])
  })

  fs.writeFile(path.join(dest, filename), tmp, (err) => {
    if (err) return console.error(err)
    console.info(`Generated ${filename} file`)
    return true
  })
}

export default create
