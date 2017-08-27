const GET_START = 'place/GET_START';
const GET_FAIL = 'place/GET_FAIL';
const GETS_START = 'place/GETS_START';
const GETS_SUCCESS = 'place/GETS_SUCCESS';
const GETS_FAIL = 'place/GETS_FAIL';
const SET_PLACE = 'place/SET_PLACE';
const SET_CURRENT_PLACE = 'place/SET_CURRENT_PLACE';
const SET_FIND_PLACE = 'place/SET_FIND_PLACE';
const INITIALIZED = 'place/INITIALIZED';
const REFRESH = 'place/REFRESH';

const initialState = {
  current: {},
  item: {},
  items: [],
  initialized: false,
  loaded: false,
  loading: false
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case INITIALIZED:
      return {
        ...state,
        initialized: true
      };
    case REFRESH:
      return {
        ...state,
      };
    case GETS_START:
      return {
        ...state,
        loading: true
      };
    case GETS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: action.res.body.items
      };
    case GETS_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case GET_START:
      return {
        ...state,
        loading: true
      };
    case GET_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case SET_PLACE:
      return {
        ...state,
        item: action.item
      };
    case SET_CURRENT_PLACE:
      return {
        ...state,
        current: {
          id: 'current-position',
          ...action.item
        }
      };
    case SET_FIND_PLACE: {
      const res = action.item;
      const location = res.geometry.location;
      return {
        ...state,
        loading: false,
        loaded: true,
        item: {
          id: res.id,
          name: res.name,
          image: '/images/no-image-place.png',
          link: res.url,
          position: [location.lng, location.lat, 0]
        }
      };
    }
    default:
      return state;
  }
}

export function initialized() {
  return {
    type: INITIALIZED,
  };
}

export function setPlace(item) {
  return {
    type: SET_PLACE,
    item
  };
}

export function setFindPlace(item) {
  return {
    type: SET_FIND_PLACE,
    item
  };
}

export function setCurrentPlace(item) {
  return {
    type: SET_CURRENT_PLACE,
    item
  };
}
