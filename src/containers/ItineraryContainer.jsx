import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import Itinerary from '../components/Itinerary';
import { disableTrace, setPlace } from '../reducers/place';
import { lock as lockItinerary } from '../reducers/itinerary';

const ItineraryContainer = (props, context) => (
  <div>
    <Itinerary
      {...props.itinerary}
      locked={props.locked}
      onClickPlace={(place) => {
        props.disableTrace();
        context.fetcher.place
          .get({
            id: place.id
          })
          .then((res) => {
            props.setPlace(res.body);
          });
      }}
      onClickLock={props.lockItinerary}
      onChangePlan={(plan) => {
        context.fetcher.plan
          .update({
            id: plan.id,
            sojourn: plan.sojourn,
            communication: plan.communication.id || plan.communication
          })
          .then(() =>
            context.fetcher.itinerary.get({
              id: props.itinerary.id
            })
          );
      }}
      onChangeItineraryDate={(start) => {
        context.fetcher.itinerary
          .update({
            id: props.itinerary.id,
            start
          })
          .then(() =>
            context.fetcher.itinerary.get({
              id: props.itinerary.id
            })
          );
      }}
      onRemove={(id) => {
        context.fetcher.plan
          .remove({
            id
          })
          .then(() =>
            context.fetcher.itinerary.get({
              id: props.itinerary.id
            })
          );
      }}
      onReplace={(id, items) => {
        context.fetcher.plan
          .replaces({
            id,
            itinerary: props.itinerary,
            items: items.map(item => ({
              id: item.id,
              itinerary: item.itinerary.id,
              place: item.place,
              sojourn: item.sojourn,
              communication: item.communication,
              order: item.order
            }))
          })
          .then(() =>
            context.fetcher.itinerary.get({
              id: props.itinerary.id
            })
          );
      }}
    />
  </div>
);

ItineraryContainer.propTypes = {
  itinerary: PropTypes.object.isRequired,
  disableTrace: PropTypes.func.isRequired,
  locked: PropTypes.bool.isRequired,
  lockItinerary: PropTypes.func.isRequired
};

ItineraryContainer.contextTypes = {
  lang: PropTypes.string.isRequired,
  fetcher: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired
};

const connected = connect(
  state => ({
    itinerary: state.itinerary.item,
    locked: state.itinerary.locked
  }),
  {
    disableTrace,
    setPlace,
    lockItinerary
  }
)(ItineraryContainer);

const asynced = asyncConnect([
  {
    promise: ({ store: { dispatch }, helpers: { fetcher }, params }) => {
      const promises = [];
      dispatch(disableTrace());
      promises.push(
        fetcher.itinerary
          .get({
            id: params.id
          })
          .then(res =>
            res.body.plans.length
              ? fetcher.place.get({
                id: res.body.plans[0].place.id
              })
              : {}
          )
          .then(res => (res.body ? dispatch(setPlace(res.body)) : {}))
      );
      return Promise.all(promises);
    }
  }
])(connected);

export default asynced;
