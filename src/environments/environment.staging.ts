// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
export const environment = {
  env: 'staging',
  production: true,
  locale: {
    default: 'ja',
    fallback: 'ja'
  },
  currency: 'JPY',
  sentry: {
    dsn: 'https://9069fb6690f14d4880873297360ef221@sentry.io/1364658',
    debug: true,
    useRaven: true,
    enabled: true
  },
  google: {
    chart: {
      url: `//chart.apis.google.com/chart`
    },
    storage: 'https://storage.googleapis.com/lobby.stg1.m27613.com/swbo/'
  },
  hmr: false,
  debugLog: false,
  version: '33.0.2',
  name: 'RED-WOLF',
  api: {
    url: 'http://api.skywind.asiangaming-etiloader.com/',
    endpoint: {
      api: 'api',
      assets: 'assets'
    }
  },
  threshold: {
    requestTimeout: 15000,
    fileMaxSize: 100000000
  },
  base_href: './'
};
