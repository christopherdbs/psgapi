import { rateLimit } from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  limit: 50,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  ipv6Subnet: 56,
});
