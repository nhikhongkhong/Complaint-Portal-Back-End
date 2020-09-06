const httpStatus = require('http-status');
const Account = require('../models/account.model 2');
const APIError = require('../utils/APIError');
const emailProvider = require('../services/emails/emailProvider');

/**
 * Map to store OTP
 */
var map = new Map();

/**
 * Returns true if valid account and an OPT is provided for the corresponding email
 * @public
 */
exports.login = async (req, res, next) => {
  const email = req.body.email;
  await Account.findOne({ email: email })
    .then(account => {
      if (account) {
        console.log("Generating OTP code...");
        const otp = (Math.floor(Math.random() * 10000) + 10000)
          .toString()
          .substring(1);
        console.log("Generated OTP: ", otp);
        
        // put into map
        map.set(email, otp);

        emailProvider.sendDashboardLogin({email: email, otp: otp})
        return res.status(200).json(true);
      }
      throw new APIError({
        status: httpStatus.UNAUTHORIZED,
        message: 'No account found with that email',
      });
    })
    .catch(err => {
      return next(err)
    });
};

/**
 * 
 */
exports.confirm = async (req, res, next) => {
  const email = req.body.email;
  await Account.findOne({email: email})
    .then(account => {
      if (account == null) {
        throw new APIError({
          status: httpStatus.UNAUTHORIZED,
          message: 'No account found with that email',
        });
      } else {
        const otp = req.body.otp;
        console.log(otp);
        let flag = false;
        if (map.get(email) == otp) {
          flag = true;
          console.log("Logging in as " + account.role);
        } else {
          throw new APIError({
            status: httpStatus.UNAUTHORIZED,
            message: 'Invalid OTP',
          });
        }
        const data = { flag: flag, role: account.role };
        res.status(200).send(data);
      }
    })
    .catch(err => {
      return next(err)
    })
}
