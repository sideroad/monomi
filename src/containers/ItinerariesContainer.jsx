import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { asyncConnect } from 'redux-connect';
import { stringify } from 'koiki';
import uris from '../uris';
import Itineraries from '../components/Itineraries';

const ItinerariesContainer = (props, context) =>
  <div>
    <Itineraries
      itineraries={props.itineraries}
      onClickItinerary={(itinerary) => {
        props.push(stringify(uris.pages.itinerary, { lang: context.lang, id: itinerary.id }));
      }}
      onAddItinerary={(itinerary) => {
        context.fetcher.itinerary.add(itinerary)
          .then(() =>
            context.fetcher.itinerary.gets()
          );
      }}
    />
  </div>;

ItinerariesContainer.propTypes = {
  itineraries: PropTypes.array.isRequired,
  push: PropTypes.func.isRequired,
};

ItinerariesContainer.contextTypes = {
  lang: PropTypes.string.isRequired,
  fetcher: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired
};

const connected = connect(
  state => ({
    itineraries: state.itinerary.items
  }),
  { push }
)(ItinerariesContainer);

const asynced = asyncConnect([{
  promise: ({ helpers: { fetcher } }) => {
    const promises = [];
    promises.push(fetcher.itinerary.gets());
    return Promise.all(promises);
  }
}])(connected);

export default asynced;
