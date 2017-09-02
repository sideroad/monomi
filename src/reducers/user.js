const SET = 'user/SET';

const initialState = {
  item: {},
  authed: false,
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET:
      return {
        ...state,
        item: action.item,
        authed: true
      };
    default:
      return state;
  }
}

export function set(item) {
  return {
    type: SET,
    item
  };
}
