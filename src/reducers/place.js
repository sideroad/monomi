const GET_START = 'place/GET_START';
const GET_FAIL = 'place/GET_FAIL';
const GETS_START = 'place/GETS_START';
const GETS_SUCCESS = 'place/GETS_SUCCESS';
const GETS_FAIL = 'place/GETS_FAIL';
const SET_PLACE = 'place/SET_PLACE';
const SET_PLACES = 'place/SET_PLACES';
const SET_CURRENT_PLACE = 'place/SET_CURRENT_PLACE';
const SET_FIND_PLACE = 'place/SET_FIND_PLACE';
const INITIALIZED = 'place/INITIALIZED';
const REFRESH = 'place/REFRESH';
const ENABLE_TRACE = 'place/ENABLE_TRACE';
const DISABLE_TRACE = 'place/DISABLE_TRACE';
const TOGGLE_FILTER = 'place/TOGGLE_FILTER';

const initialState = {
  current: {},
  item: {},
  items: [],
  initialized: false,
  loaded: false,
  loading: false,
  trace: true,
  filtered: false,
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
    case TOGGLE_FILTER:
      return {
        ...state,
        filtered: !state.filtered,
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
        item: action.item,
        items: state.items.map(item =>
          (action.item.id === item.id ? action.item : item)
        )
      };
    case SET_PLACES:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: action.items
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
      const exists = state.items.filter(item => item.id === action.item.id).length;
      const item = {
        ...action.item,
        position: [action.item.lng, action.item.lat, 0],
        favorite: false
      };
      return {
        ...state,
        loading: false,
        loaded: true,
        item,
        items: exists ? state.items : state.items.concat([item])
      };
    }
    case ENABLE_TRACE:
      return {
        ...state,
        trace: true
      };
    case DISABLE_TRACE:
      return {
        ...state,
        trace: false
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

export function setPlaces(items) {
  return {
    type: SET_PLACES,
    items
  };
}

export function enableTrace() {
  return {
    type: ENABLE_TRACE
  };
}

export function disableTrace() {
  return {
    type: DISABLE_TRACE
  };
}

export function toggleFilter() {
  return {
    type: TOGGLE_FILTER
  };
}
