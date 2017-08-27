import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import autoBind from 'react-autobind';
// import update from 'immutability-helper';
import FindPlace from '../components/FindPlace';
import WorldMap from '../components/WorldMap';
import Place from '../components/Place';
import { update as updateMap, idle as idleMap } from '../reducers/map';
import { initialized as placeInitialized, setPlace, setCurrentPlace, setFindPlace } from '../reducers/place';
import getLocation from '../helpers/location';

const styles = require('../css/home.less');

// eslint-disable-next-line
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 1,
      height: 1,
      opened: false,
    };
    this.idle = true;
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
    getLocation()
      .then((location) => {
        this.props.setCurrentPlace({
          ...location
        });
        this.props.updateMap({
          ...this.props.mapViewState,
          latitude: location.lat,
          longitude: location.lng,
          zoom: 14,
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
    this.context.fetcher.place.get({
      placeid: item.id
    }).then(
      (res) => {
        const location = res.body.result.geometry.location;
        this.props.updateMap({
          ...this.props.mapViewState,
          latitude: location.lat,
          longitude: location.lng,
          zoom: 14,
        });
        this.props.setFindPlace(res.body.result);
      }
    );
  }

  onChangeViewport(mapViewState) {
    this.props.updateMap({
      ...mapViewState,
      pitch: mapViewState.pitch > 60 ? 60 : mapViewState.pitch
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
          mapViewState={this.props.mapViewState}
          width={this.state.width}
          height={this.state.height}
          places={this.props.places}
          selected={this.props.place}
          current={this.props.current}
          onChangeViewport={this.onChangeViewport}
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
  mapViewState: PropTypes.object,
  updateMap: PropTypes.func.isRequired,
  setPlace: PropTypes.func.isRequired,
  setCurrentPlace: PropTypes.func.isRequired,
  setFindPlace: PropTypes.func.isRequired,
  children: PropTypes.element,
  placeInitialized: PropTypes.func.isRequired,
};

Home.defaultProps = {
  mapViewState: {},
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
    mapViewState: state.map.mapViewState,
  }),
  { placeInitialized, updateMap, idleMap, push, setPlace, setCurrentPlace, setFindPlace }
)(Home);

export default connected;
