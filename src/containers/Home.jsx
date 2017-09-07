import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import autoBind from 'react-autobind';
// import update from 'immutability-helper';
import FindPlace from '../components/FindPlace';
import WorldMap from '../components/WorldMap';
import Place from '../components/Place';
import FavoriteFilter from '../components/FavoriteFilter';
import { TAG } from '../reducers/suggest';
import { initialized as placeInitialized, setPlace, setPlaces, setCurrentPlace, setFindPlace, enableTrace, disableTrace, toggleFilter, setBounds } from '../reducers/place';
import { watch as watchLocation, get as getLocation, calc as calcLocation, doubleBounds } from '../helpers/location';

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
        zoom: 15,
        pitch: 30,
        bearing: 0
      },
      focused: false,
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
    if (this.props.authed) {
      this.context.fetcher.user.post({
        facebook: this.props.user.id
      });
    }
    window.addEventListener('resize', () => this.onResize());
    watchLocation(this.syncLocation);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.trace && nextProps.trace) {
      getLocation(this.syncLocation);
    }
  }

  onResize() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  onFocusPlaceFinder() {
    this.setState({
      focused: true
    });
  }

  onBlurPlaceFinder() {
    this.setState({
      focused: false
    });
  }

  onChangePlace(input) {
    if (!input) {
      return;
    }
    if (this.waitMapViewportId) {
      clearTimeout(this.waitMapViewportId);
    }
    this.waitMapViewportId = setTimeout(() => {
      this.context.fetcher.suggest.gets({
        input
      });
    }, 250);
  }

  onClickCurrentPlace() {
    this.props.enableTrace();
  }

  onClickFavoriteFilter() {
    this.props.toggleFilter();
  }

  onClickFavorite() {
    let promise;
    if (!this.props.place.favorite) {
      promise = this.context.fetcher.favorite.add({
        place: this.props.place.id
      });
    } else {
      promise = this.context.fetcher.favorite.remove({
        place: this.props.place.id
      });
    }
    promise
      .then(() =>
        this.props.setPlace({
          ...this.props.place,
          favorite: !this.props.place.favorite,
          color: !this.props.place.favorite ? [236, 109, 113] : [44, 169, 225]
        })
      );

  }

  onSelectPlace(item) {
    this.props.disableTrace();
    if (item.type === TAG) {
      this.context.fetcher.place.gets({
        tag: item.id
      }).then((res) => {
        const places = res.body.items;
        const calcedViewState = calcLocation(places);
        this.setState({
          mapViewState: {
            ...this.state.mapViewState,
            ...calcedViewState
          }
        });
        this.props.setPlaces(places);
        this.props.setPlace(calcedViewState.place);
        this.setBounds();
      });
    } else {
      (!item.lat && !item.lng ?
        this.context.fetcher.place.find({
          placeid: item.id
        }).then(res => res.body)
      :
        this.context.fetcher.place.get({
          id: item.id
        }).then(res => res.body)
      ).then((place) => {
        this.setState({
          mapViewState: {
            ...this.state.mapViewState,
            latitude: place.lat,
            longitude: place.lng,
            zoom: 15,
          }
        });
        this.props.setFindPlace(place);
        this.setBounds();
      });
    }
  }

  onViewportChange(mapViewState) {
    if (this.props.trace) {
      this.props.disableTrace();
    }
    this.setState({
      mapViewState: {
        ...mapViewState,
        pitch: mapViewState.pitch > 60 ? 60 : mapViewState.pitch
      }
    });

    if (this.waitMapViewportId) {
      clearTimeout(this.waitMapViewportId);
    }
    this.waitMapViewportId = setTimeout(() => {
      this.setBounds();
    }, 500);
  }

  onLayerClick(info) {
    if (info) {
      this.props.setPlace(info.object);
    }
  }

  setBounds() {
    const bounds = this.worldMap.mapgl.getMap().getBounds();
    this.props.setBounds(doubleBounds(bounds));
  }

  syncLocation(location) {
    this.props.setCurrentPlace({
      ...location
    });

    if (this.props.trace) {
      this.setState({
        mapViewState: {
          ...this.state.mapViewState,
          latitude: location.lat,
          longitude: location.lng,
        }
      });
      this.setBounds();
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
          onFocus={this.onFocusPlaceFinder}
          onBlur={this.onBlurPlaceFinder}
          onChange={this.onChangePlace}
          onSelect={this.onSelectPlace}
          onClickCurrentPlace={this.onClickCurrentPlace}
          trace={this.props.trace}
        />
        {
          !this.state.focused ?
            <FavoriteFilter
              filtered={this.props.filtered}
              onClickFilter={this.onClickFavoriteFilter}
            />
          : ''
        }
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
              favorite={this.props.place.favorite}
              onClickFavorite={this.onClickFavorite}
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
  enableTrace: PropTypes.func.isRequired,
  disableTrace: PropTypes.func.isRequired,
  trace: PropTypes.bool.isRequired,
  authed: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  filtered: PropTypes.bool.isRequired,
  toggleFilter: PropTypes.func.isRequired,
  setBounds: PropTypes.func.isRequired,
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
    places: state.place.targets,
    suggests: state.suggest.items,
    place: state.place.item,
    current: state.place.current,
    trace: state.place.trace,
    filtered: state.place.filtered,
    authed: state.user.authed,
    user: state.user.item,
  }),
  {
    placeInitialized,
    push,
    setPlace,
    setCurrentPlace,
    setFindPlace,
    setPlaces,
    enableTrace,
    disableTrace,
    toggleFilter,
    setBounds,
  }
)(Home);

export default connected;
