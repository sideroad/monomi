import config from './config';

export default {
  place: {
    gets: {
      url: 'https://chaus.herokuapp.com/apis/monomi/places',
      method: 'GET',
      cache: {
        client: true,
        server: true,
      }
    },
    get: {
      url: `${config.app.base}/bff/google/maps/api/place/details/json`,
      method: 'GET',
      defaults: {
        key: config.googleapis.key,
        language: 'en'
      },
      cache: {
        client: true
      }
    }
  },
  suggest: {
    gets: {
      url: '/bff/google/maps/api/place/autocomplete/json',
      method: 'GET',
      defaults: {
        key: config.googleapis.key
      }
    }
  }
};
