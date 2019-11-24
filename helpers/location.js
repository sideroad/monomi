import geolib from 'geolib';

const positionOptions = {
  maximumAge: 5000,
  timeout: 3000
};

const watch = callback =>
  navigator.geolocation.watchPosition((location) => {
    console.log('# watchPosition', location);

    callback({
      lat: location.coords.latitude,
      lng: location.coords.longitude
    });
  }, err => console.log(err), positionOptions);

const get = callback =>
  navigator.geolocation.getCurrentPosition((location) => {
    console.log('# getCurrentPosition', location);
    callback({
      lat: location.coords.latitude,
      lng: location.coords.longitude
    });
  }, err => console.log(err), positionOptions);

const calc = (places) => {
  const center = geolib.getCenter(places.map(place => ({
    latitude: place.lat,
    longitude: place.lng,
  })));

  const nearestPlaceFromCenter = geolib.orderByDistance(center, places.map(place => ({
    ...place,
    latitude: place.lat,
    longitude: place.lng,
  })))[0] || {};

  return {
    place: nearestPlaceFromCenter,
    latitude: Number(nearestPlaceFromCenter.latitude),
    longitude: Number(nearestPlaceFromCenter.longitude),
    zoom: 15
  };
};

const doubleBounds = (bounds) => {
  const diff = {
    //eslint-disable-next-line no-underscore-dangle
    lat: Number(bounds._ne.lat) - Number(bounds._sw.lat),
    //eslint-disable-next-line no-underscore-dangle
    lng: Number(bounds._ne.lng) - Number(bounds._sw.lng),
  };
  return {
    ne: {
      //eslint-disable-next-line no-underscore-dangle
      lat: Number(bounds._sw.lat) - diff.lat,
      //eslint-disable-next-line no-underscore-dangle
      lng: Number(bounds._sw.lng) - diff.lng,
    },
    sw: {
      //eslint-disable-next-line no-underscore-dangle
      lat: Number(bounds._ne.lat) + diff.lat,
      //eslint-disable-next-line no-underscore-dangle
      lng: Number(bounds._ne.lng) + diff.lng,
    }
  };
};

const isInside = ({ place, bounds }) =>
  bounds.sw.lat >= place.lat &&
  bounds.ne.lat <= place.lat &&
  bounds.sw.lng >= place.lng &&
  bounds.ne.lng <= place.lng;

export {
  watch,
  get,
  calc,
  doubleBounds,
  isInside,
};
