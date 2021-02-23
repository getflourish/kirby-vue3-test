require('dotenv').config()
const { readFileSync, writeFileSync } = require('fs')
const { minify } = require('terser')

/**
 * Generates a random string like `af51-7184-69cd`
 *
 * @returns {string} Random string
 */
function random () {
  const segment = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  return `${segment()}-${segment()}-${segment()}`
}

const swManifest = JSON.parse(readFileSync('public/assets/manifest.json'))
const swSrcPath = 'frontend/src/serviceWorker.js'
const swDistPath = 'public/service-worker.js'

const assets = Object.values(swManifest).map(i => `/assets/${i.file}`)
const bundle = `
  self.__PRECACHE_MANIFEST = [${assets.map(i => `'${i}'`).join(',')}]
  const VERSION = '${random()}'
  const KIRBY_API_SLUG = '${process.env.KIRBY_API_SLUG || 'api'}'
  const CONTENT_API_SLUG = '${process.env.CONTENT_API_SLUG}'
  ${readFileSync(swSrcPath)}
`

minify(bundle).then(({ code }) => {
  writeFileSync(swDistPath, code)
  console.log('\x1b[32m%s\x1b[0m', `Created service worker with ${assets.length} additional assets to precache.`)
})
