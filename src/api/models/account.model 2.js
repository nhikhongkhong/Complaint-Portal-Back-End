const mongoose = require("mongoose");
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');
const APIError = require('../utils/APIError');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');

/**
 * Account roles
 */
const roles = ['admin','investigator'];

/**
 * Account Schema
 * @private
 */
const AccountSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: roles,
    required: true
  },
  department: {
    type: String,
    required: false
  }
});

/**
 * Methods
 */
AccountSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'email', 'role', 'department',];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },

  token() {
    const playload = {
      exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
      iat: moment().unix(),
      sub: this._id,
    };
    return jwt.encode(playload, jwtSecret);
  },

  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  },
});

/**
 * Statics
 */
AccountSchema.statics = {

  roles,

  /**
   * Get Account
   *
   * @param {ObjectId} id - The objectId of Account.
   * @returns {Promise<Account, APIError>}
   */
  async get(id) {
    try {
      let Account;

      if (mongoose.Types.ObjectId.isValid(id)) {
        Account = await this.findById(id).exec();
      }
      if (Account) {
        return Account;
      }

      throw new APIError({
        message: 'Account does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * Find Account by email and tries to generate a JWT token
   *
   * @param {ObjectId} id - The objectId of Account.
   * @returns {Promise<Account, APIError>}
   */
  async findAndGenerateToken(options) {
    const { email, password, refreshObject } = options;
    if (!email) throw new APIError({ message: 'An email is required to generate a token' });

    const Account = await this.findOne({ email }).exec();
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };
    if (password) {
      if (Account && await Account.passwordMatches(password)) {
        return { Account, accessToken: Account.token() };
      }
      err.message = 'Incorrect email or password';
    } else if (refreshObject && refreshObject.AccountEmail === email) {
      if (moment(refreshObject.expires).isBefore()) {
        err.message = 'Invalid refresh token.';
      } else {
        return { Account, accessToken: Account.token() };
      }
    } else {
      err.message = 'Incorrect email or refreshToken';
    }
    throw new APIError(err);
  },

  /**
   * List Accounts in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of Accounts to be skipped.
   * @param {number} limit - Limit number of Accounts to be returned.
   * @returns {Promise<Account[]>}
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
    const Account = await this.findOne({ $or: [{ [`services.${service}`]: id }, { email }] });
    if (Account) {
      Account.services[service] = id;
      if (!Account.name) Account.name = name;
      if (!Account.picture) Account.picture = picture;
      return Account.save();
    }
    const password = uuidv4();
    return this.create({
      services: { [service]: id }, email, password, name, picture,
    });
  },
};

module.exports = mongoose.model("Account", AccountSchema);
