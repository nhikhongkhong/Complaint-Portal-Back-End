const httpStatus = require('http-status');
const { omit } = require('lodash');
const Complainant = require('../models/complainant.model');

/**
 * Load complainant and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const complainant = await Complainant.get(id);
    req.locals = { complainant };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get complainant
 * @public
 */
exports.get = (req, res) => res.json(req.locals.complainant.transform());

/**
 * Get logged in complainant info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.complainant.transform());

/**
 * Create new complainant
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const complainant = new Complainant(req.body);
    const savedComplainant = await complainant.save();
    res.status(httpStatus.CREATED);
    res.json(savedComplainant.transform());
  } catch (error) {
    next(Complainant.checkDuplicateEmail(error));
  }
};

/**
 * Replace existing complainant
 * @public
 */
exports.replace = async (req, res, next) => {
  try {
    const { complainant } = req.locals;
    const newComplainant = new Complainant(req.body);
    const ommitRole = complainant.role !== 'admin' ? 'role' : '';
    const newComplainantObject = omit(newComplainant.toObject(), '_id', ommitRole);

    await complainant.updateOne(newComplainantObject, { override: true, upsert: true });
    const savedComplainant = await Complainant.findById(complainant._id);

    res.json(savedComplainant.transform());
  } catch (error) {
    next(Complainant.checkDuplicateEmail(error));
  }
};

/**
 * Update existing complainant
 * @public
 */
exports.update = (req, res, next) => {
  const ommitRole = req.locals.complainant.role !== 'admin' ? 'role' : '';
  const updatedComplainant = omit(req.body, ommitRole);
  const complainant = Object.assign(req.locals.complainant, updatedComplainant);

  complainant.save()
    .then(savedComplainant => res.json(savedComplainant.transform()))
    .catch(e => next(Complainant.checkDuplicateEmail(e)));
};

/**
 * Get complainant list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const complainants = await Complainant.list(req.query);
    const transformedComplainants = complainants.map(complainant => complainant.transform());
    res.json(transformedComplainants);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete complainant
 * @public
 */
exports.remove = (req, res, next) => {
  const { complainant } = req.locals;

  complainant.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};
