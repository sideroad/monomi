
const REPLACES_START = 'plan/REPLACES_START';
const REPLACES_SUCCESS = 'plan/REPLACES_SUCCESS';

const initialState = {
  loaded: false,
  loading: false
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case REPLACES_START:
      return {
        ...state,
        loading: true
      };
    case REPLACES_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
      };
    default:
      return state;
  }
}
