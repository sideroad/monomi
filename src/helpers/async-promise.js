const series = (promises, results = []) =>
  new Promise((resolve) => {
    if (promises.length) {
      promises
        .shift()()
        .then((res) => {
          results.push(res);
          return series(promises, results);
        })
        .then(res => resolve(res));
    } else {
      resolve(results);
    }
  });

const mapSeries = ({ args, fn, results = [], interval = 10 }) =>
  new Promise((resolve) => {
    setTimeout(() => {
      if (args.length) {
        fn(args.shift())
          .then(
            (res) => {
              results.push(res);
            },
            () => {},
          )
          .then(
            () => mapSeries({ args, fn, results, interval })
          )
          .then(res => resolve(res));
      } else {
        resolve(results);
      }
    }, interval);
  });

export {
  series,
  mapSeries,
};
