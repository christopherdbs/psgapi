import { models } from '../models/index.js';
import { error, rules } from '../helpers/const.js';
import logger from '../helpers/logger.js';

const getModel = (req) => {
  const model_name = req.path.split('/')[1];
  return models[model_name];
};

export const handlers = function (params) {
  var mod = {};

  mod.getAll = async (req, res, next) => {
    let options = {
      limit: rules.limit,
      select: rules.exclude,
      populate: params,
      sort: 'id',
    };

    const url = new URL(req.protocol + '://' + req.hostname + req.originalUrl);
    logger.info(`Asked url ${url} by `);

    const rawQueryParams = url.search.slice(1).split('=');
    let query = {};
    const Model = await getModel(req);
    if (params?.model) {
      params.model = await models[params.model];
    }
    if (rawQueryParams.includes('page')) {
      options.page = parseInt(rawQueryParams[rawQueryParams.findIndex((elt) => elt == 'page') + 1]);
    }
    if (rawQueryParams.includes('offset')) {
      options.offset = parseInt(rawQueryParams[rawQueryParams.findIndex((elt) => elt == 'offset') + 1]);
    }
    await Model.paginate(query, options)
      .then((result) => {
        return res.send(result);
      })
      .catch((e) => {
        logger.error(e);
        return res.send(error);
      });
  };
  mod.getOne = async (req, res, next) => {
    const Model = await getModel(req);
    logger.info(req.params);
    if (params?.model) {
      params.model = await models[params.model];
    }
    await Model.find(req.params, { __v: 0, _id: 0 })
      .populate(params)
      .then((result) => {
        return res.send(result);
      })
      .catch((e) => {
        logger.error(e);
        return res.send(error);
      });
  };

  mod.getMatches = async (req, res, next) => {
    const Model = models['match'];
    await Model.where(params)
      .equals(req.params.id)
      .then((result) => {
        return res.send(result);
      })
      .catch((e) => {
        logger.error(e);
        return res.send(error);
      });
  };

  return mod;
};
