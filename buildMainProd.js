import { readFileSync, writeFileSync } from 'fs'

const renderjs = readFileSync('./app/build/renderer.prod.js', { encoding: 'utf-8' })
const styles = readFileSync('./app/build/styles.css', { encoding: 'utf-8' })
const mainjs = readFileSync('./app/main.ts', { encoding: 'utf-8' })

// replacing scripts with special characters https://javascript.info/string#special-characters
const res = mainjs
  .replace('<script></script>',
    () => `<script>\`+${JSON.stringify(renderjs).replace('</script>', '<\\/script>')}+\`</script>`)
  .replace('<style type="text/css"></style>',
    () => `<style type="text/css">\`+${JSON.stringify(styles).replace('</style>', '<\\/style>')}+\`</style>`)

writeFileSync('app/main.preprod.ts', res, 'utf-8')
