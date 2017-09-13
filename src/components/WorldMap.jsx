import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DeckGL, { ScatterplotLayer } from 'deck.gl';
import MapGL from 'react-map-gl';
import TripsLayer from './trips-layer';
import config from '../config';

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
    const timestamp = Date.now();
    const loopLength = this.props.loopTime;
    const loopTime = this.props.loopTime * 10;

    this.setState({
      time: ((timestamp % loopTime) / loopTime) * loopLength
    });
    this.animationFrame = window.requestAnimationFrame(this.animate.bind(this));
  }

  render() {
    if (__SERVER__) {
      return (<div />);
    }
    const layers = [
      new ScatterplotLayer({
        id: 'places',
        data: this.props.places
          .concat([this.props.selected]
            .filter(item => item.id)
            .map(item => ({
              ...item,
              color: [230, 230, 230],
              radius: 1,
              position: [item.lng, item.lat, 0]
            }))
          )
          .concat([this.props.current]
            .filter(item => item.id)
            .map(item => ({
              ...item,
              color: [170, 207, 83],
              radius: 1,
              position: [item.lng, item.lat, 0]
            }))
          ),
        opacity: 0.75,
        strokeWidth: 2,
        pickable: true,
        radiusScale: 25,
        radiusMinPixels: 2,
        radiusMaxPixels: 15,
      }),
      new TripsLayer({
        id: 'routes',
        data: this.props.routes,
        getPath: d => d.segments,
        getColor: () => [170, 207, 83],
        opacity: 1,
        strokeWidth: 100,
        trailLength: 500,
        currentTime: this.state.time
      })
    ];

    return (
      <MapGL
        ref={(elem) => { this.mapgl = elem; }}
        width={this.props.width}
        height={this.props.height}
        {...this.props.mapViewState}
        mapboxApiAccessToken={TOKEN}
        dragRotate
        mapStyle="mapbox://styles/sideroad/ciz10g2k7000p2rq7hd9jp215"
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
  loopTime: PropTypes.number.isRequired,
};

WorldMap.defaultProps = {
  width: undefined,
  height: undefined,
  selected: {},
  current: {},
};

export default WorldMap;
