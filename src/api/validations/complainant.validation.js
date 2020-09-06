const Joi = require('joi');
const Complainant = require('../models/complainant.model');

module.exports = {

  // GET /v1/complainants
  listComplainants: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      name: Joi.string(),
      email: Joi.string(),
      type: Joi.string().valid(Complainant.types),
    },
  },

  // POST /v1/complainants
  createComplainant: {
    body: {
      firtName: Joi.string(),
      lastName: Joi.string(),
      email: Joi.string().email(),
      type: Joi.string().valid(Complainant.types),
    },
  },

  // PUT /v1/complainants/:complainantId
  replaceComplainant: {
    body: {
      firtName: Joi.string(),
      lastName: Joi.string(),
      email: Joi.string().email(),
      type: Joi.string().valid(Complainant.types),
    },
    params: {
      complainantId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/complainants/:complainantId
  updateComplainant: {
    body: {
      firtName: Joi.string(),
      lastName: Joi.string(),
      email: Joi.string().email(),
      type: Joi.string().valid(Complainant.types),
    },
    params: {
      complainantId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
