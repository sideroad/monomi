import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { stringify } from '../helpers/url';
import uris from '../uris';
import Itineraries from '../components/Itineraries';
import { Context } from '../helpers/context';

const ItinerariesContainer = (props) => {
  const context = useContext(Context);
  return (
    <div>
      <Itineraries
        itineraries={props.itineraries}
        onClickItinerary={(itinerary) => {
          Router.push(
            uris.pages.itinerary,
            stringify(uris.pages.itinerary, { id: itinerary.id })
          );
        }}
        onAddItinerary={(itinerary) => {
          context.fetcher.itinerary.add(itinerary).then(() => context.fetcher.itinerary.gets());
        }}
      />
    </div>
  );
};

ItinerariesContainer.getInitialProps = async({ fetcher }) {
  await fetcher.itinerary.gets();
  return {};
}

export default connect(
  state => ({
    itineraries: state.itinerary.items,
  }),
  { }
)(ItinerariesContainer);
