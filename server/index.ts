const express = require('express')
const bodyParser = require('body-parser')
const readPkg = require('read-pkg')

import { parse } from 'url'
import * as next from 'next'

import { setupWellKnowRoutes } from './routes'

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const pkgJson = readPkg.sync()

app.prepare().then(async () => {
  const server = express()
  server.use(bodyParser.urlencoded({ extended: false }))
  server.use(bodyParser.json())

  server.set('FQDN', 'http://app.local:3000')
  server.set('version', pkgJson.version)

  await setupWellKnowRoutes(server)

  server.get('/conf', (_, res) => {
    res.json({ build_id: app.readBuildId() })
  })
  server.get('/about', (req, res) => app.render(req, res, '/about', req.query))

  server.get('*', (req, res) => {
    const parsedUrl = parse(req.url, true)
    return handle(req, res, parsedUrl)
  })

  await new Promise((resolve, reject) => {
    server.listen(port, err => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
  console.log(`> Ready on http://localhost:${port}`)
})
