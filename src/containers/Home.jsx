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
import { initialized as placeInitialized } from '../reducers/place';

const styles = require('../css/home.less');

// eslint-disable-next-line
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 1,
      height: 1,
      opened: false,
      place: undefined
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
          zoom: 13,
        });
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
      this.setState({
        place: info.object
      });
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
          place={this.props.place}
          onChangeViewport={this.onChangeViewport}
          onLayerClick={this.onLayerClick}
          placeInitialized={this.props.placeInitialized}
          onRender={this.onRenderWorldMap}
        />
        {
          this.state.place ?
            <Place
              name={this.state.place.name}
              image={this.state.place.image}
              link={this.state.place.link}
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
  mapViewState: PropTypes.object,
  updateMap: PropTypes.func.isRequired,
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
    mapViewState: state.map.mapViewState,
  }),
  { placeInitialized, updateMap, idleMap, push }
)(Home);

export default connected;
