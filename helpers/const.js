export const baseUrl = 'https://psgapi.com/api';

export const statusCode = {
  success: 200,
  error: 500,
  notFound: 404,
  unauthorized: 401,
  forbidden: 403,
  tooManyRequest: 429,
};

export const rules = {
  exclude: '-_id -__v',
  limit: 20,
};

export const error = {
  success: false,
  message: 'Something went wrong.',
};
