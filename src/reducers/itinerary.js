
const GETS_START = 'itinerary/GETS_START';
const GETS_SUCCESS = 'itinerary/GETS_SUCCESS';
const GETS_FAIL = 'itinerary/GETS_FAIL';
const GET_START = 'itinerary/GET_START';
const GET_SUCCESS = 'itinerary/GET_SUCCESS';
const GET_FAIL = 'itinerary/GET_FAIL';

const initialState = {
  item: {},
  items: [],
  loaded: false,
  loading: false,
  openItinerary: false,
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
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
    case GET_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        item: action.res.body,
        openItinerary: true,
      };
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
