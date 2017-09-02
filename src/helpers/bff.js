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
      Promise.all(
        places.map(place =>
          request
            .get(`https://chaus.herokuapp.com/apis/monomi/places/${place}`)
        )
      )
    )
    .then(responses => responses.map(response => response.body));

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
  app.get('/apis/places', (req, res) => {
    Promise.all([
      req.query.tag ?
        getPlacesByTag(req)
      :
        request
          .get('https://chaus.herokuapp.com/apis/monomi/places?limit=100000')
          .then(response => response.body.items),
      request
        .get('https://chaus.herokuapp.com/apis/monomi/favorites')
        .send({
          user: req.user.id,
          limit: 1000
        })
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
        .get('https://chaus.herokuapp.com/apis/monomi/tags')
        .send({
          name: `*${req.query.input}*`,
          limit: 1000
        })
        .then(response =>
          response.body.items.map(item => ({
            ...item,
            type: TAG,
            image: '/images/tag.png'
          }))
        )
        .then(tags =>
          Promise.all(tags.map(tag =>
            request
              .get('https://chaus.herokuapp.com/apis/monomi/taggings')
              .send({
                tag: tag.id,
                limit: 1
              })
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
            .filter(tag => tag.count >= 10)
        ),
      request
        .get('https://chaus.herokuapp.com/apis/monomi/places')
        .send({
          name: `*${req.query.input}*`,
          limit: 1000
        })
        .then(response =>
          response.body.items.map(item => ({
            ...item,
            type: PLACE,
            image: '/images/pin.png'
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
            image: '/images/pin.png'
          }))
        ),
    ]).then(([tags, places]) => {
      res.json({
        items: tags.concat(places).slice(0, 10)
      });
    }, err => console.log(err));
  });
}
