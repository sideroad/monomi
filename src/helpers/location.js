import geolib from 'geolib';

const get = () =>
  new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition((location) => {
      resolve({
        lat: location.coords.latitude,
        lng: location.coords.longitude
      });
    });
  });

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
  get,
  calc
};
