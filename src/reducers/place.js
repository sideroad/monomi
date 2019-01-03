const GET_START = 'place/GET_START';
const GET_FAIL = 'place/GET_FAIL';
const GETS_START = 'place/GETS_START';
const GETS_SUCCESS = 'place/GETS_SUCCESS';
const GETS_FAIL = 'place/GETS_FAIL';
const SET_PLACE = 'place/SET_PLACE';
const SET_PLACES = 'place/SET_PLACES';
const SET_CURRENT_PLACE = 'place/SET_CURRENT_PLACE';
const INITIALIZED = 'place/INITIALIZED';
const REFRESH = 'place/REFRESH';
const ENABLE_TRACE = 'place/ENABLE_TRACE';
const DISABLE_TRACE = 'place/DISABLE_TRACE';
const TOGGLE_FAVORITE_FILTER = 'place/TOGGLE_FAVORITE_FILTER';
const SET_BOUNDS = 'place/SET_BOUNDS';

const initialState = {
  current: {},
  item: {},
  items: [],
  targets: [],
  initialized: false,
  loaded: false,
  loading: false,
  trace: true,
  filtered: false,
  bounds: {
    ne: {
      lat: 85,
      lng: 180
    },
    sw: {
      lat: -85,
      lng: -180
    }
  }
};

const filter = (filtered, items, bounds) => {
  const targets = filtered ? items.filter(item => item.favorite) : items;
  return targets.filter(
    item =>
      item.lat >= bounds.ne.lat &&
      item.lat <= bounds.sw.lat &&
      item.lng >= bounds.ne.lng &&
      item.lng <= bounds.sw.lng
  );
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
        ...state
      };
    case TOGGLE_FAVORITE_FILTER: {
      const filtered = !state.filtered;
      return {
        ...state,
        filtered,
        targets: filter(filtered, state.items, state.bounds)
      };
    }
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
        items: action.res.body.items,
        targets: filter(state.filtered, action.res.body.items, state.bounds)
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
    case SET_PLACE: {
      const items = state.items.find(item => item.id === action.item.id)
        ? state.items.map(item => (item.id === action.item.id ? action.item : item))
        : state.items.concat([action.item]);
      return {
        ...state,
        loading: false,
        loaded: true,
        item: action.item,
        items,
        targets: filter(state.filtered, items, state.bounds)
      };
    }
    case SET_PLACES:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: action.items,
        targets: filter(state.filtered, action.items, state.bounds)
      };
    case SET_CURRENT_PLACE:
      return {
        ...state,
        current: {
          id: 'current-position',
          ...action.item
        }
      };
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
    case SET_BOUNDS:
      return {
        ...state,
        bounds: action.bounds,
        targets: filter(state.filtered, state.items, action.bounds)
      };
    default:
      return state;
  }
}

export function initialized() {
  return {
    type: INITIALIZED
  };
}

export function setPlace(item) {
  return {
    type: SET_PLACE,
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
    type: TOGGLE_FAVORITE_FILTER
  };
}

export function setBounds(bounds) {
  return {
    type: SET_BOUNDS,
    bounds
  };
}
