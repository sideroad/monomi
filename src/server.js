import Express from 'express';
import favicon from 'serve-favicon';
import compression from 'compression';
import path from 'path';
import http from 'http';
import { server, passporter } from 'koiki';
import PrettyError from 'pretty-error';
import 'isomorphic-fetch';
import config from './config';
import uris from './uris';
import urls from './urls';
import routes from './routes';
import reducers from './reducers';
import bff from './helpers/bff';

const app = new Express();
const pretty = new PrettyError();

app.use(compression());
app.use(favicon(path.join(__dirname, '..', 'static', 'images', 'favicon.png')));

app.use(Express.static(path.join(__dirname, '..', 'static')));
passporter.use({ facebook: config.facebook }, app, config.app.base);

bff({
  app
});

server({
  urls,
  reducers,
  routes,
  isDevelopment: __DEVELOPMENT__,
  app,
  path: uris.pages.root,
  origin: config.app.base,
  i18ndir: path.join(__dirname, '/../i18n'),
  statics: config.app.statics,
  handlers: {
    error: error => console.error('ROUTER ERROR:', pretty.render(error))
  },
  manifest: {
    name: config.app.title,
    description: config.app.description,
    background_color: '#171917',
  }
});

if (config.port) {

  new http.Server(app).listen(config.port, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> ✅  %s is running, talking to API server.', config.app.title);
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port);
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
