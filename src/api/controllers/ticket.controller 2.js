const httpStatus = require('http-status');
const { omit } = require('lodash');
const Ticket = require('../models/ticket.model 2'); 
const Email = require("../services/emails/emailProvider");

/**
 * Load ticket and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const ticket = await Ticket.get(id);
    req.locals = { ticket };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get ticket
 * @public
 */
exports.get = (req, res) => res.json(req.locals.ticket.transform());

/**
 * Get logged in ticket info
 * @public
 */
exports.loggedIn = (req, res) => res.json(req.ticket.transform());

/**
 * Create new ticket and send submitted ticket confirming email for complainant
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const ticket = new Ticket(req.body);
    const savedTicket = await ticket.save();
    res.status(httpStatus.CREATED);
    res.json(savedTicket.transform());

    const ticketObject = {
      firstName: req.body.firstName,
      _id: savedTicket._id,
      title: savedTicket.title,
      category: savedTicket.category,
      content: savedTicket.content,
      severityLevel: savedTicket.severityLevel,
      email: req.body.email
    }

    Email.sendSubmitConfirm(ticketObject);
  } catch (error) {
   
  }
};

/**
 * Update existing ticket
 * @public
 */
exports.update = (req, res, next) => {
  const ommitRole = req.locals.ticket.role !== 'admin' ? 'role' : '';
  const updatedTicket = omit(req.body, ommitRole);
  const ticket = Object.assign(req.locals.ticket, updatedTicket);

  ticket.save()
    .then(savedTicket => res.json(savedTicket.transform()))
    .catch(e => next(Ticket.checkDuplicateEmail(e)));
};

/**
 * Get ticket list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const tickets = await Ticket.list(req.query);
    const transformedTickets = tickets.map(ticket => ticket.transform());
    res.json(transformedTickets);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete ticket
 * @public
 */
exports.remove = (req, res, next) => {
  const { ticket } = req.locals;

  ticket.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};

/**
 * Upload report for the ticket
 * @public
 */
exports.upload = (req, res, next) => {
  const report = {
    name: req.files[0].originalname,
    fileType: req.files[0].mimetype,
    path: req.files[0].path,
    size: req.files[0].size
  };

  Ticket.updateOne({ _id: ObjectID(id) }, { $set: { report: report } })
    .then(() => {
      console.log("Updated - " + id);
    })
    .catch(err => {
      console.log("Error: " + err);
      flag = false;
    });
}

/**
 * Download report
 */
exports.download = (req, res) => {
  const filename = req.params.filename;
  res.download(`./uploads/${filename}`);  
}