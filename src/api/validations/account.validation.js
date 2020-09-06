const Joi = require('joi');
const Account = require('../models/account.model 2');

module.exports = {

  // GET /v1/accounts
  listAccounts: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      name: Joi.string(),
      email: Joi.string(),
      role: Joi.string().valid(Account.roles),
      department: Joi.string(),
    },
  },

  // POST /v1/accounts
  createAccount: {
    body: {
        name: Joi.string(),
        email: Joi.string(),
        role: Joi.string().valid(Account.roles),
        department: Joi.string(),
    },
  },

  // PUT /v1/accounts/:accountId
  replaceAccount: {
    body: {
        name: Joi.string(),
        email: Joi.string(),
        role: Joi.string().valid(Account.roles),
        department: Joi.string(),
    },
    params: {
      accountId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/accounts/:accountId
  updateAccount: {
    body: {
        name: Joi.string(),
        email: Joi.string(),
        role: Joi.string().valid(Account.roles),
        department: Joi.string(),
    },
    params: {
      accountId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
