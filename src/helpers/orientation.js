
const watch = callback =>
  window.addEventListener('deviceorientation', (event) => {
    console.log(event);
    callback(event);
  });

export default watch;
