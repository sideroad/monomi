fetch('https://chaus.herokuapp.com/apis/monomi/plans?user=&place=&fields=&expands=&orderBy=&limit=10000')
  .then(res => res.json())
  .then(res =>
    res.items.map(item =>
      fetch(`https://chaus.herokuapp.com/apis/monomi/places/${item.place.id}`).then(res =>
        res.ok
          ? true
          : fetch(`https://chaus.herokuapp.com/apis/monomi/plans/${item.id}`, { method: 'DELETE' })
      )
    )
  );
