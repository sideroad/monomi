import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DeckGL, { ScatterplotLayer } from 'deck.gl';
import MapGL from 'react-map-gl';
import { TripsLayer } from '@deck.gl/experimental-layers';
import config from '../config';
import constants from '../constants';

const TOKEN = config.mapbox.token;

class WorldMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0
    };
  }
  componentDidMount() {
    this.map = this.mapgl.getMap();
    this.animate();
  }

  componentWillUnmount() {
    if (this.animationFrame) {
      window.cancelAnimationFrame(this.animationFrame);
    }
  }

  animate() {
    if (this.props.routes.length && this.props.routes[0].segments.length > 1) {
      const { loopLength, animationSpeed } = this.props;
      const timestamp = Date.now() / 1000;
      const loopTime = loopLength / animationSpeed;

      this.setState({
        time: ((timestamp % loopTime) / loopTime) * loopLength
      });
      this.animationFrame = window.requestAnimationFrame(this.animate.bind(this));
    }
  }

  render() {
    if (__SERVER__) {
      return <div />;
    }
    const layers = [
      new ScatterplotLayer({
        id: 'places',
        data: this.props.places,
        getPosition: d => d.position,
        getColor: d => d.color,
        opacity: 0.75,
        strokeWidth: 2,
        pickable: true,
        radiusScale: 25,
        radiusMinPixels: 2,
        radiusMaxPixels: 15
      })
    ];
    if (this.props.routes.length && this.props.routes[0].segments.length > 1) {
      layers.push(
        new TripsLayer({
          id: 'routes',
          data: this.props.routes,
          getPath: d => d.segments,
          getColor: () => constants.ROUTE,
          opacity: 1,
          trailLength: 120,
          currentTime: this.state.time
        })
      );
    }

    return (
      <MapGL
        ref={(elem) => {
          this.mapgl = elem;
        }}
        width={this.props.width}
        height={this.props.height}
        {...this.props.mapViewState}
        mapboxApiAccessToken={TOKEN}
        dragRotate
        mapStyle="mapbox://styles/sideroad/cjp5ew6o10s0l2rofj1trv6u8"
        onViewportChange={this.props.onViewportChange}
      >
        <DeckGL
          debug
          width={this.props.width}
          height={this.props.height}
          {...this.props.mapViewState}
          layers={layers}
          onLayerClick={this.props.onLayerClick}
          onWebGLInitialized={this.props.placeInitialized}
        />
      </MapGL>
    );
  }
}

WorldMap.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  mapViewState: PropTypes.object.isRequired,
  places: PropTypes.array.isRequired,
  selected: PropTypes.object,
  current: PropTypes.object,
  placeInitialized: PropTypes.func.isRequired,
  onLayerClick: PropTypes.func.isRequired,
  onViewportChange: PropTypes.func.isRequired,
  routes: PropTypes.array.isRequired,
  loopLength: PropTypes.number.isRequired,
  animationSpeed: PropTypes.number
};

WorldMap.defaultProps = {
  width: undefined,
  height: undefined,
  selected: {},
  current: {},
  animationSpeed: 120
};

export default WorldMap;
