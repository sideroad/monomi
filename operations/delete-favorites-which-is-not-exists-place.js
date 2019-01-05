fetch(
  'https://chaus.now.sh/apis/monomi/favorites?user=&place=&fields=&expands=&orderBy=&limit=10000'
)
  .then(res => res.json())
  .then(res =>
    res.items.map(item =>
      fetch(`https://chaus.now.sh/apis/monomi/places/${item.place.id}`).then(res =>
        res.ok
          ? true
          : fetch(`https://chaus.now.sh/apis/monomi/favorites/${item.id}`, { method: 'DELETE' })
      )
    )
  );
