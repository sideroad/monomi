
const GETS_START = 'suggest/GETS_START';
const GETS_SUCCESS = 'suggest/GETS_SUCCESS';
const GETS_FAIL = 'suggest/GETS_FAIL';

const initialState = {
  items: [],
  loaded: false,
  loading: false
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case GETS_START:
      return {
        ...state
      };
    case GETS_SUCCESS:
      return {
        ...state,
        items: action.res.body.predictions.map(prediction => ({
          id: prediction.place_id,
          name: prediction.terms.map(term => term.value).join(', '),
        }))
      };
    case GETS_FAIL:
      return {
        ...state,
        error: action.error
      };
    default:
      return state;
  }
}
