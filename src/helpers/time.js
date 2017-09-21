
const stringify = (min) => {
  const hours = Math.floor(min / 60);
  const minutes = min % 60;
  return `${hours >= 2 ? `${hours} hrs` : hours === 1 ? `${hours} hr` : ''} ${minutes !== 0 ? `${minutes} min` : ''}`;
};

const objectize = (min) => {
  const hours = Math.floor(min / 60);
  const minutes = min % 60;
  return {
    hours,
    minutes
  };
};

const padding = number =>
  `0${number}`.slice(-2);

const parse = ({ hours, minutes }) =>
  (Number(hours) * 60) + Number(minutes);

export {
  stringify,
  objectize,
  parse,
  padding,
};
