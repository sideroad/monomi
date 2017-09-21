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
      url: `${config.app.base}/apis/places/:id`,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      cache: {
        server: true,
      }
    },
    find: {
      url: `${config.app.base}/apis/find`,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
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
  },
  itinerary: {
    gets: {
      url: `${config.app.base}/apis/itineraries`,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    },
    get: {
      url: `${config.app.base}/apis/itineraries/:id`,
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    },
    add: {
      url: `${config.app.base}/apis/itineraries`,
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    },
    update: {
      url: `${config.app.base}/apis/itineraries/:id`,
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    }
  },
  plan: {
    add: {
      url: `${config.app.base}/apis/plans`,
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    },
    remove: {
      url: 'https://chaus.herokuapp.com/apis/monomi/plans/:id',
      method: 'DELETE',
      mode: 'cors',
      credentials: 'include',
    },
    update: {
      url: 'https://chaus.herokuapp.com/apis/monomi/plans/:id',
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    },
    replaces: {
      url: `${config.app.base}/apis/itineraries/:id/plans`,
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    }
  }
};
