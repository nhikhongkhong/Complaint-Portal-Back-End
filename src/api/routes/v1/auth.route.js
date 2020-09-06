const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/auth.controller');
const {
  login,
  confirm,
} = require('../../validations/auth.validation');

const router = express.Router();

/**
 * @api {post} v1/auth/login Login
 * @apiDescription Get an OTP
 * @apiVersion 1.0.0
 * @apiName Login
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}         email     User's email
 *
 * @apiSuccess  {String}  flag     return true if valid email
 * @apiSuccess  {String}  OTP     an OTP will be sent to the logining email
 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized     Incorrect email
 */
router.route('/login')
  .post(validate(login), controller.login);


/**
 * @api {post} v1/auth/login/confirm Confirm
 * @apiDescription Confirm OTP
 * @apiVersion 1.0.0
 * @apiName ConfirmOTP
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiParam  {String}  email         User's email
 * @apiParam  {String}  otp           Refresh token aquired when user logged in
 *
 * @apiSuccess {String}  flag     True if OTP matched
 * @apiSuccess {String}  role     Access role : investigator/admin

 *
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
 * @apiError (Unauthorized 401)  Unauthorized     Incorrect email or otp
 */
router.route('/login/confirm')
  .post(validate(confirm), controller.confirm);

module.exports = router;
