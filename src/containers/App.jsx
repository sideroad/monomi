import React from 'react';
import PropTypes from 'prop-types';
import { asyncConnect } from 'redux-connect';
import Helmet from 'react-helmet';
import config from '../config';

const App = props => (
  <div>
    {props.children}
    <Helmet {...config.app.head} title={config.app.description} />
    <script src="/js/analytics.js" />
  </div>
);

App.propTypes = {
  children: PropTypes.element
};

App.contextTypes = {
  lang: PropTypes.string.isRequired,
  fetcher: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired
};

export default asyncConnect([
  {
    promise: () => {
      const promises = [];
      return Promise.all(promises);
    }
  }
])(App);
