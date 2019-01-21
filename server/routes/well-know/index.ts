const readPkg = require('read-pkg')

export const setupWellKnowRoutes = async app => {
  const pkgJson = readPkg.sync()

  app.get('/.well-known/version', (_, res) =>
    res.json({ version: app.get('version') || pkgJson.version })
  )

  app.get('/.well-known/conf', (_, res) => {
    return res.json({
      http_version_endpoint: `${app.get('FQDN')}/.well-known/version`,
      http_health_endpoint: `${app.get('FQDN')}/.well-kwnown/health`,
    })
  })
}
