import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { auth } from 'koiki';

import App from './containers/App';
import { default as Home } from './containers/Home';
import { default as ItinerariesContainer } from './containers/ItinerariesContainer';
import { default as ItineraryContainer } from './containers/ItineraryContainer';
import { default as Terms } from './containers/Terms';
import NotFound from './containers/NotFound';
import { set as setUser } from './reducers/user';
import uris from './uris';
import config from './config';

export default (store, cookie) =>
  /**
   * Please keep routes in alphabetical order
   */
  <Route
    path={uris.pages.root}
    component={App}
    onEnter={auth.login(store, cookie, config.app.base, 'facebook', setUser)}
  >
    <IndexRoute component={Home} />
    <Route path={uris.pages.home} component={Home}>
      <Route path={uris.pages.itinerary} component={ItineraryContainer} />
      <Route path={uris.pages.itineraries} component={ItinerariesContainer} />
      <Route path={uris.pages.terms} component={Terms} />
    </Route>
    { /* Catch all route */ }
    <Route path="*" component={NotFound} status={404} />
  </Route>;
