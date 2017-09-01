import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import autoBind from 'react-autobind';
// import update from 'immutability-helper';
import FindPlace from '../components/FindPlace';
import WorldMap from '../components/WorldMap';
import Place from '../components/Place';
import { TAG } from '../reducers/suggest';
import { initialized as placeInitialized, setPlace, setPlaces, setCurrentPlace, setFindPlace } from '../reducers/place';
import { watch as watchLocation, calc as calcLocation } from '../helpers/location';

const styles = require('../css/home.less');

// eslint-disable-next-line
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 1,
      height: 1,
      opened: false,
      mapViewState: {
        latitude: 35.949097014978605,
        longitude: 136.00705539354635,
        zoom: 5.2,
        pitch: 30,
        bearing: 0
      },
    };
    autoBind(this);
  }

  componentWillMount() {
    this.onResize();
  }

  componentDidMount() {
    this.context.fetcher.place.gets({
      limit: 100000
    });
    window.addEventListener('resize', () => this.onResize());
    watchLocation((location) => {
      this.props.setCurrentPlace({
        ...location
      });

      this.setState({
        mapViewState: {
          ...this.state.mapViewState,
          latitude: location.lat,
          longitude: location.lng,
          zoom: 15,
        }
      });
    });
  }

  onResize() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  onChangePlace(input) {
    this.context.fetcher.suggest.gets({
      input
    });
  }

  onSelectPlace(item) {
    console.log(item);
    if (item.type === TAG) {
      this.context.fetcher.tagging.gets({
        tag: item.id
      }).then((res) => {
        Promise.all(
          res.body.items.map(tagging =>
            this.context.fetcher.place.get({
              id: tagging.place.id
            })
            .then(json => json.body)
          )
        ).then((places) => {
          const calcedViewState = calcLocation(places);
          this.setState({
            mapViewState: {
              ...this.state.mapViewState,
              ...calcedViewState
            }
          });
          this.props.setPlaces(places);
          this.props.setPlace(calcedViewState.place);
        });
      });
    } else {
      this.context.fetcher.place.gets({
        limit: 100000
      });
      this.context.fetcher.place.find({
        placeid: item.id
      }).then(
        (res) => {
          const location = res.body.result.geometry.location;
          this.setState({
            mapViewState: {
              ...this.state.mapViewState,
              latitude: location.lat,
              longitude: location.lng,
              zoom: 15,
            }
          });
          this.props.setFindPlace(res.body.result);
        }
      );
    }
  }

  onViewportChange(mapViewState) {
    this.setState({
      mapViewState: {
        ...mapViewState,
        pitch: mapViewState.pitch > 60 ? 60 : mapViewState.pitch
      }
    });
  }

  onLayerClick(info) {
    if (info) {
      this.props.setPlace(info.object);
    }
  }

  handleOpen() {
    this.setState({ opened: true });
  }

  handleClose() {
    this.setState({ opened: false });
  }

  render() {

    return (
      <div className={styles.container}>
        <FindPlace
          suggests={this.props.suggests}
          onChange={this.onChangePlace}
          onSelect={this.onSelectPlace}
        />
        <WorldMap
          ref={(elem) => { this.worldMap = elem; }}
          mapViewState={this.state.mapViewState}
          width={this.state.width}
          height={this.state.height}
          places={this.props.places}
          selected={this.props.place}
          current={this.props.current}
          onViewportChange={this.onViewportChange}
          onLayerClick={this.onLayerClick}
          placeInitialized={this.props.placeInitialized}
          onRender={this.onRenderWorldMap}
        />
        {
          this.props.place.name ?
            <Place
              name={this.props.place.name}
              image={this.props.place.image}
              link={this.props.place.link}
            />
          : null
        }
        {this.props.children ? this.props.children : ''}
      </div>
    );
  }
}

Home.propTypes = {
  places: PropTypes.array.isRequired,
  suggests: PropTypes.array.isRequired,
  place: PropTypes.object.isRequired,
  current: PropTypes.object.isRequired,
  setPlace: PropTypes.func.isRequired,
  setCurrentPlace: PropTypes.func.isRequired,
  setFindPlace: PropTypes.func.isRequired,
  setPlaces: PropTypes.func.isRequired,
  children: PropTypes.element,
  placeInitialized: PropTypes.func.isRequired,
};

Home.defaultProps = {
};

Home.contextTypes = {
  lang: PropTypes.string.isRequired,
  fetcher: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
};

const connected = connect(
  state => ({
    places: state.place.items,
    suggests: state.suggest.items,
    place: state.place.item,
    current: state.place.current,
  }),
  { placeInitialized, push, setPlace, setCurrentPlace, setFindPlace, setPlaces }
)(Home);

export default connected;
