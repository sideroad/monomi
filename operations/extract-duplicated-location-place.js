const locations = {};
fetch(
  'https://chaus.herokuapp.com/apis/monomi/places?user=&place=&fields=&expands=&orderBy=&limit=1000000'
)
  .then(res => res.json())
  .then(res =>
    res.items.map((item) => {
      const location = `${item.lat}:${item.lng}`;
      if (locations[location]) {
        locations[location].push(item);
      } else {
        locations[location] = [item];
      }
    })
  )
  .then(() => {
    const duplications = Object.keys(locations)
      .map(location => (locations[location].length > 1 ? locations[location] : undefined))
      .filter(item => item);
    let counter = 0;
    const deletes = [];
    console.log(duplications);

    duplications.map((places) => {
      places.map((place) => {
        counter++;
        setTimeout(
          () =>
            fetch(`https://chaus.herokuapp.com/apis/monomi/plans?place=${place.id}`)
              .then(res => res.json())
              .then(res =>
                res.items.length
                  ? places
                      .filter(place => res.items.every(item => item.place.id !== place.id))
                      .forEach(place => deletes.push(place.id))
                  : places
                      .filter((item, index) => index !== 0)
                      .forEach(place => deletes.push(place.id))
              ),
          counter * 100
        );
      });
    });
    counter += 50;
    setTimeout(() => {
      deletes.map((id) => {
        counter++;
        setTimeout(() => {
          // fetch(`https://chaus.herokuapp.com/apis/monomi/places/${id}`, { method: 'DELETE' });
        }, counter * 100);
      });
    }, counter * 100);
  });
