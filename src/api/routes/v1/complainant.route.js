const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/complainant.controller');
const {
  listComplainants,
  createComplainant,
  updateComplainant,
} = require('../../validations/complainant.validation');

const router = express.Router();

/**
 * Load complainant when API with complainantId route parameter is hit
 */
router.param('complainantId', controller.load);


router
  .route('/')
  /**
   * @api {get} v1/complainants List Complainants
   * @apiDescription Get a list of complainants
   * @apiVersion 1.0.0
   * @apiName ListComplainants
   * @apiGroup Complainant
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   Complainant's access token
   *
   * @apiParam  {Number{1-}}         [page=1]     List page
   * @apiParam  {Number{1-100}}      [perPage=1]  Complainants per page
   * @apiParam  {String}             [name]       Complainant's name
   * @apiParam  {String}             [email]      Complainant's email
   * @apiParam  {String=complainant,admin}  [role]       Complainant's role
   *
   * @apiSuccess {Object[]} complainants List of complainants.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated complainants can access the data
   * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
   */
  .get(validate(listComplainants), controller.list)
  /**
   * @api {post} v1/complainants Create Complainant
   * @apiDescription Create a new complainant
   * @apiVersion 1.0.0
   * @apiName CreateComplainant
   * @apiGroup Complainant
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization   Complainant's access token
   *
   * @apiParam  {String}             email     Complainant's email
   * @apiParam  {String{6..128}}     password  Complainant's password
   * @apiParam  {String{..128}}      [name]    Complainant's name
   * @apiParam  {String=complainant,admin}  [role]    Complainant's role
   *
   * @apiSuccess {String}  id             Complainant's id
   * @apiSuccess {String}  firtName       Complainant's first name
   * @apiSuccess {String}  lastName       Complainant's last name
   * @apiSuccess {String}  email          Complainant's email
   * @apiSuccess {String}  type           Complainant's type
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated complainants can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(validate(createComplainant), controller.create);

router
  .route('/:complainantId')
  /**
   * @api {get} v1/complainants/:id Get Complainant
   * @apiDescription Get complainant information
   * @apiVersion 1.0.0
   * @apiName GetComplainant
   * @apiGroup Complainant
   * @apiPermission complainant
   *
   *
   * @apiSuccess {String}  id             Complainant's id
   * @apiSuccess {String}  firtName       Complainant's first name
   * @apiSuccess {String}  lastName       Complainant's last name
   * @apiSuccess {String}  email          Complainant's email
   * @apiSuccess {String}  type           Complainant's type
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated complainants can access the data
   * @apiError (Forbidden 403)    Forbidden    Only complainant with same id or admins can access the data
   * @apiError (Not Found 404)    NotFound     Complainant does not exist
   */
  .get(controller.get)
  /**
   * @api {patch} v1/complainants/:id Update Complainant
   * @apiDescription Update some fields of a complainant document
   * @apiVersion 1.0.0
   * @apiName UpdateComplainant
   * @apiGroup Complainant
   * @apiPermission complainant
   *
   * @apiHeader {String} Authorization   Complainant's access token
   *
   * @apiParam  {String}             email     Complainant's email
   * @apiParam  {String{6..128}}     password  Complainant's password
   * @apiParam  {String{..128}}      [name]    Complainant's name
   * @apiParam  {String=complainant,admin}  [role]    Complainant's role
   * (You must be an admin to change the complainant's role)
   *
   * @apiSuccess {String}  id         Complainant's id
   * @apiSuccess {String}  name       Complainant's name
   * @apiSuccess {String}  email      Complainant's email
   * @apiSuccess {String}  role       Complainant's role
   * @apiSuccess {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401) Unauthorized Only authenticated complainants can modify the data
   * @apiError (Forbidden 403)    Forbidden    Only complainant with same id or admins can modify the data
   * @apiError (Not Found 404)    NotFound     Complainant does not exist
   */
  .patch(validate(updateComplainant), controller.update)
  /**
   * @api {delete} v1/complainants/:id Delete Complainant
   * @apiDescription Delete a complainant
   * @apiVersion 1.0.0
   * @apiName DeleteComplainant
   * @apiGroup Complainant
   * @apiPermission complainant
   *
   * @apiHeader {String} Authorization   Complainant's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated complainants can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only complainant with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Complainant does not exist
   */
  .delete(controller.remove);


module.exports = router;
