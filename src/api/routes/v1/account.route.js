const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/account.controller');
const {
  listAccounts,
  createAccount,
  updateAccount,
} = require('../../validations/account.validation');

const router = express.Router();

/**
 * Load account when API with accountId route parameter is hit
 */
router.param('accountId', controller.load);


router
  .route('/')
  /**
   * @api {get} v1/accounts List Accounts
   * @apiDescription Get a list of accounts
   * @apiVersion 1.0.0
   * @apiName ListAccounts
   * @apiGroup Account
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   Account's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Accounts per page
   * @apiParam  {String}             [name]       Account's name
   * @apiParam  {String}             [email]      Account's email
   * @apiParam  {String=account,admin}  [role]       Account's role
   *
   * @apiSuccess {Object[]} accounts List of accounts.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated accounts can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(validate(listAccounts), controller.list)
  /**
   * @api {post} v1/accounts Create Account
   * @apiDescription Create a new account
   * @apiVersion 1.0.0
   * @apiName CreateAccount
   * @apiGroup Account
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   Account's access token
   *
   * @apiParam  {String}             email     Account's email
   * @apiParam  {String{6..128}}     password  Account's password
   * @apiParam  {String{..128}}      [name]    Account's name
   * @apiParam  {String=account,admin}  [role]    Account's role
   *
   * @apiSuccess {String}  id             Account's id
   * @apiSuccess {String}  firtName       Account's first name
   * @apiSuccess {String}  lastName       Account's last name
   * @apiSuccess {String}  email          Account's email
   * @apiSuccess {String}  type           Account's type
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated accounts can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(validate(createAccount), controller.create);

router
  .route('/:accountId')
  /**
   * @api {get} v1/accounts/:id Get Account
   * @apiDescription Get account information
   * @apiVersion 1.0.0
   * @apiName GetAccount
   * @apiGroup Account
   * @apiPermission account
   *
   *
   * @apiSuccess {String}  id             Account's id
   * @apiSuccess {String}  firtName       Account's first name
   * @apiSuccess {String}  lastName       Account's last name
   * @apiSuccess {String}  email          Account's email
   * @apiSuccess {String}  type           Account's type
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated accounts can access the data
   * @apiError (Forbidden 403)    Forbidden    Only account with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Account does not exist
   */
  .get(controller.get)
  /**
   * @api {patch} v1/accounts/:id Update Account
   * @apiDescription Update some fields of a account document
   * @apiVersion 1.0.0
   * @apiName UpdateAccount
   * @apiGroup Account
   * @apiPermission account
   *
   * @apiHeader {String} Authorization   Account's access token
   *
   * @apiParam  {String}             email     Account's email
   * @apiParam  {String{6..128}}     password  Account's password
   * @apiParam  {String{..128}}      [name]    Account's name
   * @apiParam  {String=account,admin}  [role]    Account's role
   * (You must be an admin to change the account's role)
   *
   * @apiSuccess {String}  id         Account's id
   * @apiSuccess {String}  name       Account's name
   * @apiSuccess {String}  email      Account's email
   * @apiSuccess {String}  role       Account's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated accounts can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only account with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Account does not exist
   */
  .patch(validate(updateAccount), controller.update)
  /**
   * @api {delete} v1/accounts/:id Delete Account
   * @apiDescription Delete a account
   * @apiVersion 1.0.0
   * @apiName DeleteAccount
   * @apiGroup Account
   * @apiPermission account
   *
   * @apiHeader {String} Authorization   Account's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated accounts can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only account with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Account does not exist
   */
  .delete(controller.remove);


module.exports = router;
