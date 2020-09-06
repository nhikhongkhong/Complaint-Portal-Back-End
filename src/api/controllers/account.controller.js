const httpStatus = require('http-status');
const { omit } = require('lodash');
const Account = require('../models/account.model 2');

/**
 * Load account and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const account = await Account.get(id);
    req.locals = { account };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get account
 * @public
 */
exports.get = (req, res) => res.json(req.locals.account.transform());

/**
 * Get logged in account info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.account.transform());

/**
 * Create new account
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const account = new Account(req.body);
    const savedAccount = await account.save();
    res.status(httpStatus.CREATED);
    res.json(savedAccount.transform());
  } catch (error) {
    next(Account.checkDuplicateEmail(error));
  }
};

/**
 * Replace existing account
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { account } = req.locals;
    const newAccount = new Account(req.body);
    const ommitRole = account.role !== 'admin' ? 'role' : '';
    const newAccountObject = omit(newAccount.toObject(), '_id', ommitRole);

    await account.updateOne(newAccountObject, { override: true, upsert: true });
    const savedAccount = await Account.findById(account._id);

    res.json(savedAccount.transform());
  } catch (error) {
    next(Account.checkDuplicateEmail(error));
  }
};

/**
 * Update existing account
 * @public
 */
exports.update = (req, res, next) => {
  const ommitRole = req.locals.account.role !== 'admin' ? 'role' : '';
  const updatedAccount = omit(req.body, ommitRole);
  const account = Object.assign(req.locals.account, updatedAccount);

  account.save()
    .then(savedAccount => res.json(savedAccount.transform()))
    .catch(e => next(Account.checkDuplicateEmail(e)));
};

/**
 * Get account list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const accounts = await Account.list(req.query);
    const transformedAccounts = accounts.map(account => account.transform());
    res.json(transformedAccounts);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete account
 * @public
 */
exports.remove = (req, res, next) => {
  const { account } = req.locals;

  account.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};

