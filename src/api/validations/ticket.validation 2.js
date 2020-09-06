const Joi = require('joi');
const Ticket = require('../models/ticket.model 2');

module.exports = {

  // GET /v1/tickets
  listTickets: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
    },
  },

  // POST /v1/tickets
  createTicket: {
    body: {
      title: Joi.string(),
      type: Joi.string(),
      category: Joi.string(),
      content: Joi.string(),
      suggestion: Joi.string(),
      complainantEmail: Joi.string(),
      status: Joi.string(),
      severityLevel: Joi.string(),
    },
  },
};
