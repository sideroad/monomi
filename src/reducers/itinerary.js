import polyline from '@mapbox/polyline';
import flatten from 'lodash/flatten';

const LOCK = 'itinerary/LOCK';
const SET_PLAN = 'itinerary/SET_PLAN';
const GETS_START = 'itinerary/GETS_START';
const GETS_SUCCESS = 'itinerary/GETS_SUCCESS';
const GETS_FAIL = 'itinerary/GETS_FAIL';
const GET_START = 'itinerary/GET_START';
const GET_SUCCESS = 'itinerary/GET_SUCCESS';
const GET_FAIL = 'itinerary/GET_FAIL';

const initialState = {
  item: {},
  items: [],
  routes: [],
  planRoutes: [],
  locked: true,
  loaded: false,
  loading: false,
  openItinerary: false,
  loopLength: 450
};
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOCK:
      return {
        ...state,
        locked: !state.locked
      };
    case SET_PLAN: {
      const planIndex = state.item.plans.findIndex(plan => plan.id === action.plan.id);
      const selectedRoutes = [state.item.plans[planIndex - 1], state.item.plans[planIndex]].filter(
        plan => plan && plan.points
      );
      const segmentsLength = selectedRoutes.reduce(
        (store, plan) => polyline.decode(plan.points).length + store,
        0
      );
      let count = 0;
      return {
        ...state,
        planRoutes: [
          {
            vendor: 1,
            segments: flatten(
              selectedRoutes.map(plan =>
                polyline
                  .decode(plan.points)
                  .map(([lat, lng]) => [
                    lng,
                    lat,
                    (state.loopLength / segmentsLength) * (count += 1)
                  ])
              )
            )
          }
        ]
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
      return {
        ...state,
        loading: false,
        loaded: true,
        item: action.res.body,
        planRoutes: [],
        routes: action.res.body.plans
          .filter(plan => plan.points)
          .map((plan) => {
            const segments = polyline.decode(plan.points);
            return {
              vendor: 1,
              segments: segments.map(([lat, lng], index) => [
                lng,
                lat,
                (state.loopLength / segments.length) * index
              ])
            };
          })
          .filter(route => route),
        openItinerary: true
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

export function lock() {
  return {
    type: LOCK
  };
}

export function setPlan(plan) {
  return {
    type: SET_PLAN,
    plan
  };
}
