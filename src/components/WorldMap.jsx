import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DeckGL, { ScatterplotLayer } from 'deck.gl';
import MapGL from 'react-map-gl';
import config from '../config';

const TOKEN = config.mapbox.token;

class WorldMap extends Component {
  render() {
    if (__SERVER__) {
      return (<div />);
    }

    const layers = [
      new ScatterplotLayer({
        id: 'places',
        data: this.props.places.map(place => ({
          ...place,
          color: [44, 169, 225],
          radius: 1,
          position: [place.lng, place.lat, 0]
        })),
        opacity: 0.5,
        strokeWidth: 2,
        pickable: true,
        radiusScale: 20,
        radiusMinPixels: 3,
        radiusMaxPixels: 200,
      }),
      new ScatterplotLayer({
        id: 'place',
        data: [this.props.place].filter(item => item.id),
        opacity: 0.5,
        strokeWidth: 2,
        radiusScale: 20,
        radiusMinPixels: 2,
        radiusMaxPixels: 100,
      })
    ];

    return (
      <MapGL
        ref={(elem) => { this.mapgl = elem; }}
        width={this.props.width}
        height={this.props.height}
        {...this.props.mapViewState}
        mapboxApiAccessToken={TOKEN}
        perspectiveEnabled
        mapStyle="mapbox://styles/sideroad/ciz10g2k7000p2rq7hd9jp215"
        onChangeViewport={this.props.onChangeViewport}
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
  place: PropTypes.object.isRequired,
  placeInitialized: PropTypes.func.isRequired,
  onLayerClick: PropTypes.func.isRequired,
  onChangeViewport: PropTypes.func.isRequired
};

WorldMap.defaultProps = {
  width: undefined,
  height: undefined,
};

export default WorldMap;
