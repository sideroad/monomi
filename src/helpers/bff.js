import { proxy } from 'koiki';
import request from 'superagent';
import config from '../config';

export default function ({ app }) {
  proxy({
    app,
    protocol: 'https',
    host: config.googleapis.host,
    prefix: '/bff/google'
  });
  app.get('/apis/suggests', (req, res) => {
    Promise.all([
      request
        .get('https://chaus.herokuapp.com/apis/monomi/tags')
        .send({
          name: `*${req.query.input}*`
        })
        .then(response =>
          response.body.items.map(item => ({
            ...item,
            name: `# ${item.name}`
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
          }))
        ),
    ]).then(([tags, places]) => {
      res.json({
        items: tags.concat(places)
      });
    }, err => console.log(err));
  });
}
