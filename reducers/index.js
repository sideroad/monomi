import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import itinerary from './itinerary';
import place from './place';
import plan from './plan';
import suggest from './suggest';
import tag from './tag';
import transaction from './transaction';
import user from './user';

export function initializeStore(initialState = {}) {
  return createStore(
    combineReducers({
      itinerary,
      place,
      plan,
      suggest,
      tag,
      transaction,
      user,
    }),
    initialState,
    composeWithDevTools(applyMiddleware())
  );
}
