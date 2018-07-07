require('babel-polyfill');
const normalize = require('koiki').normalize;

const title = 'monomi';
const description = 'going on a pleasure jaunt';

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

const appHost = process.env.GLOBAL_HOST || 'localhost';
const appPort = Number(process.env.GLOBAL_PORT || 3000);
const base = normalize(`${appHost}:${appPort}`);

module.exports = Object.assign(
  {
    host: process.env.HOST || 'localhost',
    port: Number(process.env.PORT || 3000),
    api: {
      host: 'chaus.herokuapp.com',
      port: Number('443')
    },
    googleapis: {
      key: process.env.KOIKI_MONOMI_GOOGLE_API_KEY,
      host: 'maps.googleapis.com'
    },
    mapbox: {
      token: process.env.KOIKI_MONOMI_MAPBOX_TOKEN
    },
    facebook: {
      appId: process.env.MONOMI_FACEBOOK_CLIENT_ID,
      secret: process.env.MONOMI_FACEBOOK_SECRET_ID
    },
    github: {
      appId: process.env.MONOMI_GITHUB_CLIENT_ID,
      secret: process.env.MONOMI_GITHUB_SECRET_ID
    },
    app: {
      base,
      host: appHost,
      port: appPort,
      title,
      description,
      head: {
        titleTemplate: `${title} - %s`,
        meta: [
          { name: 'description', content: description },
          { charset: 'utf-8' },
          { property: 'og:site_name', content: title },
          { property: 'og:image', content: '/images/favicon.png' },
          { property: 'og:locale', content: 'en_US' },
          { property: 'og:title', content: title },
          { property: 'og:description', content: description },
          { property: 'og:card', content: 'summary' },
          { property: 'og:creator', content: 'sideroad' },
          { property: 'og:image:width', content: '300' },
          { property: 'og:image:height', content: '300' }
        ]
      },
      statics: {
        link: [
          {
            rel: 'stylesheet',
            type: 'text/css',
            href: 'https://fonts.googleapis.com/css?family=Ubuntu'
          },
          {
            rel: 'stylesheet',
            type: 'text/css',
            href: 'https://fonts.googleapis.com/earlyaccess/hannari.css'
          },
          {
            rel: 'stylesheet',
            type: 'text/css',
            href: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css'
          },
          { rel: 'stylesheet', type: 'text/css', href: '/css/recharts.css' },
          { rel: 'stylesheet', type: 'text/css', href: '/css/normalize.css' }
        ]
      }
    }
  },
  environment
);
