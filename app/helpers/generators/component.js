import path from 'path'
import fs from 'fs'

import capitalize from './utils/capitalize'
import createFromTemplate from './utils/createFileTemplate'
/* eslint-disable */
// const arg = process.argv[2]
const rewrite = process.argv[3]
const classComponent = process.argv[4]

const isRewrite = rewrite === 'y'
const isClassComponent = classComponent === 'y'

/* eslint-disable no-console */
const args = process.argv.slice(2)

if (args.length === 0 || !/^[a-zA-z/]{1,}$/.test(args[0])) {
  throw new Error('You should specify a valid name argument')
}

const arg = process.argv[2].split('/')
const name = capitalize(arg[arg.length - 1])
const folders = arg.slice(0, -1).map(s => s.toLowerCase()).join('/')
const dest = path.join(__dirname, '../../', 'src/components', folders, name)

// createFromTemplate({ name }, dest, element, rewrite)
if (!fs.existsSync(dest) || isRewrite) {
  isClassComponent ?
  createFromTemplate('containers/_tsx', { name }, dest, `${name}.tsx`) :
  createFromTemplate('components/_tsx', { name }, dest, `${name}.tsx`)
  createFromTemplate('components/_package', { name }, dest, 'package.json')
  createFromTemplate('components/_scss', { name }, dest, `${name}.css`)
} else {
  console.log('Directory exists! use "y" key as a second argument to rewrite component')
}
