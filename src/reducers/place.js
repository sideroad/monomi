const GET_START = 'place/GETS_START';
const GET_SUCCESS = 'place/GETS_SUCCESS';
const GET_FAIL = 'place/GETS_FAIL';
const GETS_START = 'place/GETS_START';
const GETS_SUCCESS = 'place/GETS_SUCCESS';
const GETS_FAIL = 'place/GETS_FAIL';
const INITIALIZED = 'place/INITIALIZED';

const initialState = {
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
    case GET_SUCCESS: {
      const location = action.res.body.result.geometry.location;
      return {
        ...state,
        loading: false,
        loaded: true,
        item: {
          ...action.res.body.result,
          color: [230, 230, 230],
          radius: 5,
          position: [location.lng, location.lat, 0]
        }
      };
    }
    case GET_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    default:
      return state;
  }
}

export function initialized() {
  return {
    type: INITIALIZED,
  };
}
