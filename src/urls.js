import config from './config';

export default {
  place: {
    post: {
      url: 'https://chaus.herokuapp.com/apis/monomi/places',
      method: 'POST',
      mode: 'cors',
      credentials: 'include'
    },
    gets: {
      url: '/apis/places',
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
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
  },
  user: {
    post: {
      url: 'https://chaus.herokuapp.com/apis/monomi/users',
      method: 'POST'
    }
  },
  favorite: {
    add: {
      url: `${config.app.base}/apis/favorites`,
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    },
    remove: {
      url: `${config.app.base}/apis/favorites`,
      method: 'DELETE',
      mode: 'cors',
      credentials: 'include',
    }
  }
};
