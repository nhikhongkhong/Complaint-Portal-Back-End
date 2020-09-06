const mongoose = require('mongoose');
const ObjectID = require("mongodb").ObjectID;
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');
const APIError = require('../utils/APIError');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');

const Complainant = require("./complainant.model");
const Account = require("./account.model 2");

/**
 * Default status, severity level and email option
 */

const dfStatus = 'pending';
const dfSeverity = 'low';
const dfEmailOp = 'auto';

/**
 * Data prototype get week of month
 */
Date.prototype.getWeekOfMonth = function() {
  var firstWeekday = new Date(this.getFullYear(), this.getMonth(), 1).getDay();
  var offsetDate = this.getDate() + firstWeekday - 1;
  return Math.floor(offsetDate / 7);
};

/**
* Ticket types
*/
const groups = ['staff', 'student', 'public', 'annonymous'];

/**
 * Ticket Schema
 * @private
 */
const TicketSchema = mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: groups, required: true },
  category: { type: String, required: true },
  content: { type: String, required: true },
  suggestion: { type: String, required: false },
  complainantEmail: {
    type: mongoose.Schema.Types.ObjectID,
    ref: Complainant,
    required: false
  },
  dateSubmitted: {
    value: { type: Date, required: false, default: new Date() },
    year: { type: Number, default: new Date().getFullYear()},
    month: { type: Number, min: 0, max: 11, default: new Date().getMonth() },
    week: { type: Number, min: 0, max: 4, default: new Date().getWeekOfMonth() },
    day: { type: Number, min: 0, max: 30, default: new Date().getDay() }
  },
  dateClosed: {
    value: { type: Date, required: false},
    year: { type: Number },
    month: { type: Number, min: 0, max: 11 },
    week: { type: Number, min: 0, max: 4 },
    day: { type: Number, min: 0, max: 30 }
  },
  status: { type: String, required: true, default: dfStatus },
  feedbackRate: { type: Number, min: 0, max: 5 },
  assignedEmail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Account,
    required: false
  },
  severityLevel: { type: String, required: true, default: dfSeverity },
  report: {
    name: { type: String, required: false },
    fileType: { type: String, required: false },
    path: { type: String, required: false },
    size: { type: Number }
  },
  emailOption: {
    type: { type: String, default: dfEmailOp },
    data: { type: String },
    required: false
  }
});

/**
 * Methods
 */
TicketSchema.method({
  transform() {
    const transformed = {};
    const fields = ['title', 'type', 'category', 'content', 'suggestion', 'complainantEmail', 'dateSubmitted', 'dateClosed', 'status', 'feedbackRate', 'assignedEmail', 'severityLevel', 'report', 'emailOption'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
TicketSchema.statics = {

  /**
   * Get ticket
   *
   * @param {ObjectId} id - The objectId of ticket.
   * @returns {Promise<Complainant, APIError>}
   */
  async get(id) {
    try {
      let ticket;

      if (mongoose.Types.ObjectId.isValid(id)) {
        ticket = await this.findById(id).exec();
      }
      if (ticket) {
        return ticket;
      }

      throw new APIError({
        message: 'Ticket does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * List tickets in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of complainants to be skipped.
   * @param {number} limit - Limit number of complainants to be returned.
   * @returns {Promise<Complainant[]>}
   */
  list({
    page = 1, perPage = 30, title, complainantEmail, category,
  }) {
    const options = omitBy({ title, complainantEmail, category }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};

/**
 * @typedef Ticket
 */
module.exports = mongoose.model("Ticket", TicketSchema);
