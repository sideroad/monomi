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
  const bounds = places.reduce((memo, place) => ({
    maxlat: memo.maxlat <= place.lat ? place.lat : memo.maxlat,
    maxlng: memo.maxlng <= place.lng ? place.lng : memo.maxlng,
    minlat: memo.minlat >= place.lat ? place.lat : memo.minlat,
    minlng: memo.minlng >= place.lng ? place.lng : memo.minlng,
  }), {
    maxlat: places[0].lat,
    minlat: places[0].lat,
    maxlng: places[0].lng,
    minlng: places[0].lng
  });
  const distance = geolib.getDistance(
    {
      latitude: bounds.minlat,
      longitude: bounds.minlng,
    },
    {
      latitude: bounds.maxlat,
      longitude: bounds.maxlng,
    }
  );
  const center = geolib.getCenter(places.map(place => ({
    latitude: place.lat,
    longitude: place.lng,
  })));
  return {
    latitude: Number(center.latitude),
    longitude: Number(center.longitude),
    zoom: distance >= 1000000 ? 6 :
          distance >= 500000 ? 7 :
          distance >= 200000 ? 8 :
          distance >= 100000 ? 9 :
          distance >= 750000 ? 10 :
          distance >= 20000 ? 11 :
          distance >= 10000 ? 12 :
          distance >= 5000 ? 13 :
          distance >= 2000 ? 14 :
          distance >= 2000 ? 15 :
          distance >= 1000 ? 16 : 16
  };
};

export {
  get,
  calc
};
