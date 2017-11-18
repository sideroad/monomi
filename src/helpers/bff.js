import { proxy } from 'koiki';
import request from 'superagent';
import moment from 'moment';
import polyline from '@mapbox/polyline';
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
        const photo = response.body.result.photos[0];

        return {
          ...response.body.result,
          ...location,
          image: photo ? `https://${config.googleapis.host}/maps/api/place/photo?key=${config.googleapis.key}&maxwidth=500&maxheight=500&photoreference=${photo.photo_reference}` : '/images/no-image-place.png',
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

  app.get('/apis/itineraries', (req, res) => {
    request
      .get(`https://chaus.herokuapp.com/apis/monomi/itineraries?user=${req.user.id}`)
      .then(response =>
        res.json(response.body)
      );
  });

  const getDepartureTime = (from) => {
    const departure = moment(from.start).add(from.sojourn, 'minutes');
    const nextDays = departure.days() <= moment().days() ? departure.days() + 7 : departure.days();
    const next = moment()
      .days(nextDays)
      .hours(departure.hours())
      .minutes(departure.minutes())
      .seconds(0)
      .milliseconds(0);

    return moment(departure).startOf('date') > moment().startOf('date') ? departure.valueOf() / 1000 :
           next.valueOf() / 1000;
  };

  const getDirection = (req, from, to) => {
    const departureTime = getDepartureTime(from);
    const requestUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${from.place.lat},${from.place.lng}&destination=${to.place.lat},${to.place.lng}&departure_time=${departureTime}&mode=${from.communication.id}&key=${config.googleapis.key}`;
    return request
      .get(requestUrl)
      .set({
        ...req.headers,
        Host: config.googleapis.host
      })
      .then(response => ({
        direction: {
          ...response.body,
          points: polyline.decode(response.body.routes[0].overview_polyline.points)
        },
        nextStart: moment(from.start)
                     .add(from.sojourn, 'minutes')
                     .add(response.body.routes[0].legs[0].duration.value, 'seconds')
                     .format()
      }),
      () => console.error('# Direction fetch has failed. ', requestUrl)
    );
  };

  const applyStartTime = (req, next, plans = []) =>
    new Promise((resolve) => {
      const from = next.shift();
      const to = next.shift();
      if (from && to) {
        getDirection(req, from, to)
          .then(
            ({ direction, nextStart }) => {
              applyStartTime(req, [{
                ...to,
                start: nextStart
              }].concat(next), plans.concat([{
                ...from,
                end: moment(from.start).add(from.sojourn, 'minutes').format(),
                transit: Math.ceil(direction.routes[0].legs[0].duration.value / 60),
                direction: {
                  ...direction,
                  page: `https://www.google.com/maps/dir/${from.place.lat},${from.place.lng}/${to.place.lat},${to.place.lng}/`
                },
              }]))
                .then(res => resolve(res));
            }
          );
      } else {
        resolve(plans.concat([from]));
      }
    });

  app.get('/apis/itineraries/:id', (req, res) => {
    Promise.all([
      request
        .get(`https://chaus.herokuapp.com/apis/monomi/itineraries/${req.params.id}`)
        .then(response => response.body),
      request
        .get(`https://chaus.herokuapp.com/apis/monomi/plans?itinerary=${req.params.id}&limit=1000`)
        .then(response =>
          Promise.all(response.body.items.map(plan =>
            request
              .get(`https://chaus.herokuapp.com/apis/monomi/places/${plan.place.id}`)
              .then(
                json => ({
                  ...plan,
                  place: json.body
                }),
                () => console.error('# Fetch place error', plan.place.id)
              )
          ))),
    ]).then(([itinerary, plans]) => {
      applyStartTime(req, plans.sort((a, b) => (
        a.order < b.order ? -1 :
        a.order > b.order ? 1 : 0
      )).map((plan, index) =>
        (index === 0 ? { ...plan, start: moment(itinerary.start).format() } : plan)
      ))
        .then(plansWithDirection =>
          res.json({
            ...itinerary,
            plans: plansWithDirection.filter(plan => plan)
          })
        );
    });
  });

  app.post('/apis/itineraries', (req, res) => {
    request
      .post('https://chaus.herokuapp.com/apis/monomi/itineraries')
      .send({
        ...req.body,
        start: moment(req.body.start).format(),
        user: req.user.id
      })
      .then(response =>
        res.json(response.body),
        err => console.log(err) || res.json({})
      );
  });

  app.post('/apis/itineraries/:id', (req, res) => {
    request
      .post(`https://chaus.herokuapp.com/apis/monomi/itineraries/${req.params.id}`)
      .send({
        ...req.body,
        start: moment(req.body.start).format(),
      })
      .then(response =>
        res.json(response.body),
        err => console.log(err) || res.json({})
      );
  });

  app.post('/apis/plans', (req, res) => {
    request
      .get(`https://chaus.herokuapp.com/apis/monomi/plans?itinerary=${req.body.itinerary}&limit=1000`)
      .then(response => (response.body.items.sort((a, b) => (
        a.order < b.order ? 1 :
        a.order > b.order ? -1 : 0
      ))[0] || { order: 0 }).order + 1)
      .then(order =>
        request
          .post('https://chaus.herokuapp.com/apis/monomi/plans')
          .send({
            ...req.body,
            sojourn: 15,
            communication: 'driving',
            order,
          })
          .then(response =>
            res.json(response.body)
          )
      );
  });

  app.post('/apis/itineraries/:id/plans', (req, res) => {
    Promise.all(req.body.items.map(plan =>
      request
        .post(`https://chaus.herokuapp.com/apis/monomi/plans/${plan.id}`)
        .send({
          ...plan,
          itinerary: req.params.id,
        })
    )).then(() =>
      res.json({})
    );
  });
}
