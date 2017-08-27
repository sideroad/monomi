
export default function get() {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition((location) => {
      resolve({
        lat: location.coords.latitude,
        lng: location.coords.longitude
      });
    });
  });
}
