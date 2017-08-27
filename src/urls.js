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
      url: 'https://chaus.herokuapp.com/apis/monomi/places/:id',
      method: 'GET',
      cache: {
        server: true,
      }
    },
    find: {
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
      url: '/apis/suggests',
      method: 'GET'
    }
  },
  tagging: {
    gets: {
      url: 'https://chaus.herokuapp.com/apis/monomi/taggings',
      method: 'GET',
      cache: {
        client: true,
        server: true,
      }
    }
  }
};
