import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import Helmet from 'react-helmet';
import config from '../config';
import Loading from '../components/Loading';

const App = props =>
  <div>
    {props.children}
    {
      props.loading ? <Loading /> : ''
    }
    <Helmet {...config.app.head} title={config.app.description} />
    <script src="/js/analytics.js" />
  </div>;

App.propTypes = {
  children: PropTypes.element,
  loading: PropTypes.bool,
};

App.contextTypes = {
  lang: PropTypes.string.isRequired,
  fetcher: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired
};

const connected = connect(
  state => ({
    loading: state.place.loading ||
             state.transaction.loading ||
             !state.place.initialized ||
             state.plan.loading ||
             state.itinerary.loading
  }),
  {}
)(App);

export default asyncConnect([{
  promise: () => {
    const promises = [];
    return Promise.all(promises);
  }
}])(connected);
