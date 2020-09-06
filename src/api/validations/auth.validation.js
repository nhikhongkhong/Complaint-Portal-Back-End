const Joi = require('joi');

module.exports = {
  // POST /v1/auth/login/confirm
  confirm: {
    body: {
      email: Joi.string()
        .email()
        .required(),
      otp: Joi.string()
    },
  },

  // POST /v1/auth/login
  login: {
    body: {
      email: Joi.string()
        .email()
        .required(),
    },
  },
};
