const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');
const APIError = require('../utils/APIError');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');

/**
* Complainant types
*/
const types = ['staff', 'student', 'public', 'annonymous'];

/**
 * Complainant Schema
 * @private
 */
const ComplainantSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  type: {
    type: String,
    enum: types,
    required: false
  }
});

/**
 * Methods
 */
ComplainantSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'firstName', 'lastName', 'email', 'type',];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
ComplainantSchema.statics = {

  types,

  /**
   * Get complainant
   *
   * @param {ObjectId} id - The objectId of complainant.
   * @returns {Promise<Complainant, APIError>}
   */
  async get(id) {
    try {
      let complainant;

      if (mongoose.Types.ObjectId.isValid(id)) {
        complainant = await this.findById(id).exec();
      }
      if (complainant) {
        return complainant;
      }

      throw new APIError({
        message: 'Complainant does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Find complainant by email and tries to generate a JWT token
   *
   * @param {ObjectId} id - The objectId of complainant.
   * @returns {Promise<Complainant, APIError>}
   */
  async findAndGenerateToken(options) {
    const { email, password, refreshObject } = options;
    if (!email) throw new APIError({ message: 'An email is required to generate a token' });

    const complainant = await this.findOne({ email }).exec();
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };
    if (password) {
      if (complainant && await complainant.passwordMatches(password)) {
        return { complainant, accessToken: complainant.token() };
      }
      err.message = 'Incorrect email or password';
    } else if (refreshObject && refreshObject.complainantEmail === email) {
      if (moment(refreshObject.expires).isBefore()) {
        err.message = 'Invalid refresh token.';
      } else {
        return { complainant, accessToken: complainant.token() };
      }
    } else {
      err.message = 'Incorrect email or refreshToken';
    }
    throw new APIError(err);
  },

  /**
   * List complainants in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of complainants to be skipped.
   * @param {number} limit - Limit number of complainants to be returned.
   * @returns {Promise<Complainant[]>}
   */
  list({
    page = 1, perPage = 30, name, email, type,
  }) {
    const options = omitBy({ name, email, type }, isNil);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  /**
   * Return new validation error
   * if error is a mongoose duplicate key error
   *
   * @param {Error} error
   * @returns {Error|APIError}
   */
  checkDuplicateEmail(error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return new APIError({
        message: 'Validation Error',
        errors: [{
          field: 'email',
          location: 'body',
          messages: ['"email" already exists'],
        }],
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack,
      });
    }
    return error;
  },

  async oAuthLogin({
    service, id, email, name, picture,
  }) {
    const complainant = await this.findOne({ $or: [{ [`services.${service}`]: id }, { email }] });
    if (complainant) {
      complainant.services[service] = id;
      if (!complainant.name) complainant.name = name;
      if (!complainant.picture) complainant.picture = picture;
      return complainant.save();
    }
    const password = uuidv4();
    return this.create({
      services: { [service]: id }, email, password, name, picture,
    });
  },
};

/**
 * @typedef Complainant
 */
module.exports = mongoose.model("Complainant", ComplainantSchema);
