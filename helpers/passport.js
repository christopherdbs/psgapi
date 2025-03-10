import passport from 'passport';
import logger from './logger.js';
export const passportHelpers = {
  auth: async (req, res, next) => {
    passport.authenticate('bearer', { session: false }, async function (err, user) {
      if (err || !user) {
        logger.error(
          `Unauthorized access attempt with token: ${req.headers.authorization} on route: ${req.originalUrl}`
        );
        return res.status(401).send({
          success: false,
          message: 'Unauthorized.',
        });
      }
      logger.info(`Authenticated successfully with ${token}`);

      next();
    })(req, res, next);
  },
  login: async (req, res, next) => {
    passport.authenticate('local', async function (err, user, info) {
      if (err || !user) {
        logger.error(`Authentication failed for : email = ${req.body.username}`);
        return res.status(401).send({
          success: false,
          message: (info && info.message) || 'Unauthorized',
        });
      }
      logger.info(`${req.body.username} logged in successfully`);
      req.user = user;
      next();
    })(req, res, next);
  },
};
