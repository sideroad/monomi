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

export {
  watch,
  get,
  calc
};
