import geolib from 'geolib';

const watch = callback =>
  navigator.geolocation.watchPosition((location) => {
    callback({
      lat: location.coords.latitude,
      lng: location.coords.longitude
    });
  }, () => callback({
    lat: 35.949097014978605,
    lng: 136.00705539354635,
  }), {
    maximumAge: 1000
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
  watch,
  calc
};
