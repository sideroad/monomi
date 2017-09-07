import { proxy } from 'koiki';
import request from 'superagent';
import config from '../config';
import { TAG, PLACE } from '../reducers/suggest';

const getPlacesByTag = req =>
  request
    .get('https://chaus.herokuapp.com/apis/monomi/taggings')
    .send({
      ...req.query,
      limit: 100000
    })
    .then(response => response.body.items.map(item => item.place.id))
    .then(places =>
      request
        .get(`https://chaus.herokuapp.com/apis/monomi/places?id=${places.join(',')}`)
    )
    .then(response => response.body.items);

export default function ({ app }) {
  proxy({
    app,
    protocol: 'https',
    host: config.googleapis.host,
    prefix: '/bff/google'
  });
  app.post('/apis/favorites', (req, res) => {
    if (!req.user || !req.user.id) {
      res.json({});
      return;
    }
    request
      .post('https://chaus.herokuapp.com/apis/monomi/favorites')
      .send({
        user: req.user.id,
        place: req.body.place
      })
      .then(() => {
        res.json({});
      });
  });
  app.delete('/apis/favorites', (req, res) => {
    if (!req.user || !req.user.id) {
      res.json({});
      return;
    }
    request
      .delete('https://chaus.herokuapp.com/apis/monomi/favorites')
      .send({
        user: req.user.id,
        place: req.body.place
      })
      .then(() => {
        res.json({});
      });
  });
  app.get('/apis/find', (req, res) => {
    request
      .get(`https://${config.googleapis.host}/maps/api/place/details/json?key=${config.googleapis.key}&placeid=${req.query.placeid}`)
      .set({
        ...req.headers,
        Host: config.googleapis.host
      })
      .then((response) => {
        const location = response.body.result.geometry.location;
        return {
          ...response.body.result,
          ...location,
          image: '/images/no-image-place.png',
          link: response.body.result.url
        };
      }).then(place =>
        request
          .post('https://chaus.herokuapp.com/apis/monomi/places')
          .send(place)
          .then(
            response =>
              request
                .get(`https://chaus.herokuapp.com/apis/monomi/places/${response.body.id}`)
                .then(json => json.body),
            () =>
              request
                .get(`https://chaus.herokuapp.com/apis/monomi/places?name=${encodeURIComponent(place.name)}`)
                .then(json => json.body.items[0])
          )
      )
      .then(place =>
        request
          .get(`https://chaus.herokuapp.com/apis/monomi/favorites?user=${req.user.id}&place=${place.id}limit=1000`)
          .then(json => res.json({
            ...place,
            favorite: !!json.body.items.length
          }))
      );
  });
  app.get('/apis/places/:id', (req, res) => {
    Promise.all([
      request
        .get(`https://chaus.herokuapp.com/apis/monomi/places/${req.params.id}`)
        .then(response => response.body),
      request
        .get(`https://chaus.herokuapp.com/apis/monomi/favorites?user=${req.user.id}&place=${req.params.id}`)
        .then(response => response.body.items.map(favorite => favorite.place.id))
    ]).then(([place, favorites]) => {
      res.json({
        ...place,
        color: favorites.includes(place.id) ? [236, 109, 113] : [44, 169, 225],
        favorite: favorites.includes(place.id),
      });
    });
  });
  app.get('/apis/places', (req, res) => {
    Promise.all([
      req.query.tag ?
        getPlacesByTag(req)
      :
        request
          .get('https://chaus.herokuapp.com/apis/monomi/places?limit=100000')
          .then(response => response.body.items),
      request
        .get(`https://chaus.herokuapp.com/apis/monomi/favorites?user=${req.user.id}&limit=1000`)
        .then(response => response.body.items.map(item => item.place.id)),
    ]).then(([places, favorites]) => {
      res.json({
        items: places.map(place => ({
          ...place,
          color: favorites.includes(place.id) ? [236, 109, 113] : [44, 169, 225],
          favorite: favorites.includes(place.id),
          radius: 1,
          position: [place.lng, place.lat, 0]
        }))
      });
    });
  });
  app.get('/apis/suggests', (req, res) => {
    Promise.all([
      request
        .get(`https://chaus.herokuapp.com/apis/monomi/tags?name=*${encodeURIComponent(req.query.input)}*&limit=1000`)
        .then(response => response.body.items)
        .then(tags =>
          Promise.all(tags.map(tag =>
            request
              .get(`https://chaus.herokuapp.com/apis/monomi/taggings?tag=${tag.id}&limit=1`)
              .then(response => ({
                ...tag,
                count: response.body.size
              }))
          ))
        )
        .then(tags =>
          tags
            .sort((a, b) => (
              a.count < b.count ? 1 :
              a.count > b.count ? -1 : 0
            ))
            .slice(0, 5)
            .filter(tag => tag.count >= 5)
        )
        .then(tags =>
          tags.map(item => ({
            ...item,
            type: TAG,
            image: '/images/tag.png'
          }))
        ),
      request
        .get(`https://chaus.herokuapp.com/apis/monomi/places?name=*${encodeURIComponent(req.query.input)}*&limit=1000`)
        .then(response =>
          response.body.items.map(item => ({
            ...item,
            type: PLACE
          }))
        ),
      request
        .get(`https://${config.googleapis.host}/maps/api/place/autocomplete/json?key=${config.googleapis.key}&input=${encodeURIComponent(req.query.input)}`)
        .set({
          ...req.headers,
          Host: config.googleapis.host
        })
        .then(response =>
          response.body.predictions.map(prediction => ({
            id: prediction.place_id,
            name: prediction.terms.map(term => term.value).join(', '),
            type: PLACE,
            image: '/images/pin.png',
          }))
        ),
    ]).then(([tags, places, autocompletes]) => {
      res.json({
        items: tags.concat(places).concat(autocompletes).slice(0, 10)
      });
    }, err => console.log(err));
  });
}
