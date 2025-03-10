import 'dotenv/config';
const __dirname = import.meta.dirname;

import express from 'express';
import mongoose from 'mongoose';
import { connectDb } from './helpers/db.js';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import BearerStrategy from 'passport-http-bearer';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { authHelpers } from './helpers/auth.js';
import { User } from './models/User.js';
import logger from './helpers/logger.js';
import { Router } from './routes/router.js';

const port = process.env.PORT || 3000;

const app = express();

mongoose.set('debug', true);
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

passport.use(
  'bearer',
  new BearerStrategy(function (token, done) {
    logger.info(`Attempt to access with ${token}`);

    User.findOne({ token: token }, function (err, user) {
      if (err) {
        logger.error(`Error finding user: ${err.message}`);
        return done(err, false);
      }
      if (!user) {
        logger.warning(`User not found for token: ${token}`);
        return done(null, false);
      }
      logger.info(`User authenticated successfully with ${token}`);
      return done(null, user, { scope: 'read' });
    });
  })
);

passport.use(
  'local',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async function (username, password, cb) {
      logger.info(`Attempt to log in with ${username}`);
      try {
        const user = await User.findOne({ email: username });
        if (!user) {
          logger.warning(`Incorrect Username : ${username} `);

          return cb(null, false, {
            message: 'Incorrect username.',
          });
        }

        let verifPassword = await bcrypt.compare(password, user.password);
        if (!verifPassword) {
          logger.warning(`Incorrect password for ${username}`);
          return cb(null, false, {
            message: 'Incorrect password.',
          });
        }

        return cb(null, user, {
          message: 'User found.',
        });
      } catch (e) {
        logger.error(`User search failed for ${username} - ${e} `);
        cb(e);
      }
    }
  )
);

async function config() {
  const baseUrl = ['/api', '/auth'];
  const promises = baseUrl.map(async (url) => {
    const router = await Router(url);
    app.use(url, router);
  });
  const allDone = await Promise.all(promises);

  app.get('*', (req, res) => {
    res.send("Endpoint doesn't exists");
  });

  startServer();
}

async function startServer() {
  await connectDb();
  app.listen(port, () => logger.info('PSGAPI is currently running.'));
}

config();
