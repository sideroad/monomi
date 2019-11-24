import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Itinerary from '../../components/Itinerary';
import { disableTrace, setPlace } from '../../reducers/place';
import { lock as lockItinerary, setPlan } from '../../reducers/itinerary';
import { Context } from '../../helpers/context';

const ItineraryContainer = (props) => {
  const context = useContext(Context);
  return (
    <div>
      <Itinerary
        {...props.itinerary}
        locked={props.locked}
        onClickPlan={(plan) => {
          props.disableTrace();
          context.fetcher.place
            .get({
              id: plan.place.id,
            })
            .then((res) => {
              props.setPlace(res.body);
              props.setPlan(plan);
            });
        }}
        onClickLock={props.lockItinerary}
        onChangePlan={(plan) => {
          context.fetcher.plan
            .update({
              id: plan.id,
              sojourn: plan.sojourn,
              communication: plan.communication.id || plan.communication,
            })
            .then(() =>
              context.fetcher.itinerary.get({
                id: props.itinerary.id,
              })
            );
        }}
        onChangeItineraryDate={(start) => {
          context.fetcher.itinerary
            .update({
              id: props.itinerary.id,
              start,
            })
            .then(() =>
              context.fetcher.itinerary.get({
                id: props.itinerary.id,
              })
            );
        }}
        onRemove={(id) => {
          context.fetcher.plan
            .remove({
              id,
            })
            .then(() =>
              context.fetcher.itinerary.get({
                id: props.itinerary.id,
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
                order: item.order,
              })),
            })
            .then(() =>
              context.fetcher.itinerary.get({
                id: props.itinerary.id,
              })
            );
        }}
      />
    </div>
  );
};

ItineraryContainer.getInitialProps = async ({ store, fetcher }) => {
  store.dispatch(disableTrace());
  await fetcher.itinerary
    .get({
      id: params.id,
    })
    .then(res =>
      res.body.plans.length
        ? fetcher.place.get({
          id: res.body.plans[0].place.id,
        })
        : {}
    )
    .then(res => (res.body ? store.dispatch(setPlace(res.body)) : {}));
};

export default connect(
  state => ({
    itinerary: state.itinerary.item,
    locked: state.itinerary.locked,
  }),
  {
    disableTrace,
    setPlace,
    setPlan,
    lockItinerary,
  }
)(ItineraryContainer);
