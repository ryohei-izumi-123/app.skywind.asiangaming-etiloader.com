export const environment = {
  env: 'development',
  production: false,
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
