import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import logger from './logger.js';
const secretCookie = process.env.SECRETCOOKIE;

function notAllowed(req, res, message) {
  req.url === '/' ? res.redirect('/login') : res.status(500).send(message);
}

async function verifyJwt(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretCookie, async function (err, decoded) {
      if (decoded === undefined) {
        reject({ success: false, message: err });
      } else {
        resolve({ success: true, token: decoded });
      }
    });
  });
}

export const authHelpers = {
  isConnected: async (req, res, next) => {
    if (req.url === '/' || req.url === '/refreshToken') {
      const cookies = Object.keys(req.cookies);
      if (cookies.length > 0 && cookies.includes('psgapi') && cookies.includes('isConnected')) {
        if (req.cookies.isConnected === 'false') {
          clearCookies();
          authHelpers.notAllowed(req, res, {
            success: false,
            reason: 'Not allowed.',
          });
        }
        const isValid = await verifyJwt(req.cookies.psgapi);
        if (!isValid.success) {
          clearCookies();
          authHelpers.notAllowed(req, res, {
            success: false,
            reason: 'Not allowed.',
          });
        } else {
          if (req.url === '/refreshToken') {
            req.user_token = isValid.token;
          }
          next();
        }
      } else {
        authHelpers.notAllowed(req, res, {
          success: false,
          reason: 'Not allowed.',
        });
      }
    } else {
      next();
    }
  },
  clearCookies: () => {
    res.clearCookie('psgapi');
    res.clearCookie('isConnected');
  },
  sendMail: async (to, subject, text, html) => {
    let transporter;
    try {
      transporter = nodemailer.createTransport(
        nodemailer.createTransport({
          host: process.env.HOST,
          port: 465,
          secure: true,
          auth: {
            user: process.env.MAIL,
            pass: process.env.MAIL_PWD,
          },
        })
      );
    } catch (e) {
      logger.error('Error creating transport: ' + e);
      return {
        success: false,
        message: 'Failed to create transport',
      };
    }
    try {
      let info = await transporter.sendMail({
        from: '"PSGAPI" <' + process.env.NOREPLY + '>',
        to: to,
        subject: subject,
        text: text,
        html: html,
      });
      logger.info('Token sent by email successfully');
    } catch (e) {
      logger.error('Error sending token by email: ' + e);
      return {
        success: false,
        message: 'Failed to send token by email',
      };
    }
  },
  verifyJwt,
  notAllowed,
};
