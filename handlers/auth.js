import { User } from './../models/User.js';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import { nanoid } from 'nanoid';
const secretCookie = process.env.SECRETCOOKIE;
const secret = process.env.SECRET;
import { statusCode } from '../helpers/const.js';
import { authHelpers } from '../helpers/auth.js';
import logger from '../helpers/logger.js';
import jwt from 'jsonwebtoken';

function hashPwd(password) {
  let salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

export const handlers = (params) => ({
  check: async (req, res, next) => {
    const token = req.cookies.psgapi;
    const ip = req.ip;
    logger.info(`Checking if ${ip} is connected`);

    if (!token) {
      logger.warn(`Missing JWT for user IP=${ip}`);
      return res.status(401).json({ isAuthenticated: false, message: 'User not authentified.' });
    }

    jwt.verify(token, secretCookie, (err, user) => {
      if (err) {
        logger.warn(`Invalid JWT for user IP=${ip}`);
        return res.status(401).json({ isAuthenticated: false, message: 'Incorrect JWT' });
      }
      logger.info(`User ${ip} is connected`);
      res.status(200).json({ isAuthenticated: true, user, message: 'User authentified' });
    });
  },
  login: async (req, res) => {
    const user = req.user;

    await req.login(user, { session: false }, async (e) => {
      if (e) {
        logger.error('Login process failed : ' + e);
        return res.status(statusCode.error).send({
          success: false,
          message: 'Login failed',
        });
      }
      const token = jwt.sign(
        {
          user: {
            id: user.nano_id,
          },
        },
        secretCookie
      );
      res.cookie(`psgapi`, token, {
        expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      });

      logger.info(`User logged in successfully : pseudo = ${user.pseudo} and email = ${user.email}`);
      return res.json({
        success: true,
        message: 'User authenticated successfully',
      });
    });
  },
  register: async (req, res) => {
    const { email, pseudo, password, confirmPassword } = req.body;
    logger.info(`User trying to register with email = ${email} and pseudo = ${pseudo}`);
    const alreadyUsed = [];
    try {
      const emailsExists = await User.exists({ email: email });
      if (emailsExists) {
        logger.warn(`Registration failed for email = ${email} and pseudo = ${pseudo} - Email already used.`);
        alreadyUsed.push({ prop: 'email', message: 'Email already used' });
      }
    } catch (e) {
      logger.error(`Email check failed for email = ${email} and pseudo = ${pseudo} - ${e} `);
      return res.status(statusCode.error).send({
        success: false,
        message: 'An error occured during email verification',
      });
    }

    try {
      const pseudoExists = await User.exists({ pseudo: pseudo });
      if (pseudoExists) {
        logger.warn(`Registration failed for email = ${email} and pseudo = ${pseudo} - Pseudo already used.`);
        alreadyUsed.push({ prop: 'pseudo', message: 'Pseudo already used' });
      }
    } catch (e) {
      logger.error(`Pseudo check failed for email = ${email} and pseudo = ${pseudo} - ${e} `);

      return res.status(statusCode.error).send({
        success: false,
        message: 'An error occured during pseudo verification',
      });
    }

    if (alreadyUsed.length > 0) {
      return res.status(statusCode.error).send({
        success: false,
        message: 'User already exists',
        alreadyUsed: alreadyUsed,
      });
    } else if (
      validator.isEmail(email) &&
      !validator.isEmpty(pseudo) &&
      !validator.isEmpty(password) &&
      validator.equals(password, confirmPassword)
    ) {
      const hash = hashPwd(password);
      const nano_id = nanoid(20);
      let token;
      try {
        logger.info(`Signing token for email = ${email} and pseudo = ${pseudo}`);
        token = jwt.sign(
          {
            user: {
              id: nano_id,
            },
            iat: new Date().getTime(),
            refresh: false,
          },
          secret
        );
        const doc = await User.create({
          email: email,
          pseudo: pseudo,
          password: hash,
          token: token,
          nano_id: nano_id,
        });
        logger.info(`User registered successfully : pseudo = ${pseudo} and email = ${email}`);
      } catch (e) {
        logger.error(`Registration failed for email = ${email} and pseudo = ${pseudo} - ${e}.`);

        return res.status(statusCode.error).send({
          success: false,
          message: 'An error occured while registering. Please, try again',
        });
      }

      try {
        const text =
          'Welcome to the PSGAPI ! Thanks for registering, below is the token you need to include in your API calls. : ' +
          token;
        const html =
          '<b>Hello ! Thanks for registering, below is the token you need to include in your API calls : </b>' + token;
        const sendToken = await authHelpers.sendMail(email, 'Your access Token', text, html);
        if (!sendToken.success) {
          logger.error('Email process failed : ' + sendToken.message);
          return res.status(200).json({
            success: true,
            message: 'User registered successfully',
            token: token,
            mailedToken: false,
          });
        }
      } catch (e) {
        logger.error('Email process failed : ' + e);
        return res.status(200).json({
          success: true,
          message: 'User registered successfully',
          token: token,
          mailedToken: false,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'User registered successfully',
        token: token,
        mailedToken: true,
      });
    } else {
      return res.status(statusCode.error).send({
        success: false,
        message: 'Registration failed. Please, try again',
      });
    }
  },
  logout: async (req, res) => {
    const user = req.user;
    logger.info(`${user} trying to logout`);
    try {
      res.clearCookie('psgapi');
      logger.info(`${user} logged out successfully`);

      return res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (e) {
      logger.error(`Logout failed for ${user} : ${e}`);
      return res.status(statusCode.error).send({
        success: false,
        message: 'Logout failed',
      });
    }
  },
});
