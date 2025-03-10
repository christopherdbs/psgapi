import express from 'express';
import { passportHelpers } from '../helpers/passport.js';

export async function Router(baseUrl) {
  const router = express.Router();
  const { routes } = await import('.' + baseUrl + '.js');
  const { handlers } = await import('../handlers' + baseUrl + '.js');
  routes.forEach((endpoint) => {
    endpoint.type == 'get'
      ? router.route(endpoint.path).get(handlers(endpoint?.params)[endpoint.handler])
      : router
          .route(endpoint.path)
          .post([...(endpoint.helper != '' ? [passportHelpers[endpoint.helper]] : []), handlers()[endpoint.handler]]);
  });

  router.route('*').get(async function (req, res) {
    return res.status(404).send('Endpoint does not exist.');
  });

  return router;
}
