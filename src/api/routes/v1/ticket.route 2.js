const express = require('express');
const validate = require('express-validation');
const controller = require('../../controllers/ticket.controller 2');
const {
  listTickets,
  createTicket,
} = require('../../validations/ticket.validation 2');

const router = express.Router();

/**
 * Load ticket when API with ticketId route parameter is hit
 */
router.param('ticketId', controller.load);


router
  .route('/')
  /**
   * @api {get} v1/tickets List Tickets
   * @apiDescription Get a list of tickets
   * @apiVersion 1.0.0
   * @apiName ListTickets
   * @apiGroup Ticket
   * @apiPermission admin
   *   
   * @apiParam  {Number{1-}}         [page=1]           List page
   * @apiParam  {Number{1-100}}      [perPage=1]        Tickets per page
   * @apiParam  {String}             [name]             Ticket's title
   * @apiParam  {String}             [type]             Ticket's type
   * @apiParam  {String}             [category]         Ticket's category
   * @apiParam  {String}             [content]          Ticket's content
   * @apiParam  {ObjectID}           [complainantEmail] Ticket's complainant's email 
   * @apiParam  {Object}             [dateSubmitted]    Ticket's date submitted
   * @apiParam  {Object}             [dateClosed]       Ticket's date closed
   * @apiParam  {String}             [status]           Ticket's status
   * @apiParam  {String}             [severityLevel]    Ticket's severityLevel
   * @apiParam  {Object}             [report]           Ticket's report
   * @apiParam  {String}             [emailOption]      Ticket's email's option
   *
   * @apiSuccess {Object[]} tickets List of tickets.
   */
  .get(validate(listTickets), controller.list)
  /**
   * @api {post} v1/tickets Create Ticket
   * @apiDescription Create a new ticket
   * @apiVersion 1.0.0
   * @apiName CreateTicket
   * @apiGroup Ticket
   * @apiPermission admin
   *
   * @apiParam  {String}             [name]             Ticket's title
   * @apiParam  {String}             [type]             Ticket's type
   * @apiParam  {String}             [category]         Ticket's category
   * @apiParam  {String}             [content]          Ticket's content
   * @apiParam  {ObjectID}           [complainantEmail] Ticket's complainant's email 
   * @apiParam  {Object}             [dateSubmitted]    Ticket's date submitted
   * @apiParam  {Object}             [dateClosed]       Ticket's date closed
   * @apiParam  {String}             [status]           Ticket's status
   * @apiParam  {String}             [severityLevel]    Ticket's severityLevel
   * @apiParam  {Object}             [report]           Ticket's report
   * @apiParam  {String}             [emailOption]      Ticket's email's option
   *
   * @apiSuccess (Created 201) {String}  id         Ticket's id
   * @apiSuccess (Created 201) {String}  name       Ticket's name
   * @apiSuccess (Created 201) {String}  email      Ticket's email
   * @apiSuccess (Created 201) {String}  role       Ticket's role
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated tickets can create the data
   * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
   */
  .post(validate(createTicket), controller.create);

router
  .route('/:ticketId')
  /**
   * @api {get} v1/tickets/:id Get Ticket
   * @apiDescription Get ticket information
   * @apiVersion 1.0.0
   * @apiName GetTicket
   * @apiGroup Ticket
   * @apiPermission ticket
   *
   * @apiSuccess  {String}             [name]             Ticket's title
   * @apiSuccess  {String}             [type]             Ticket's type
   * @apiSuccess  {String}             [category]         Ticket's category
   * @apiSuccess  {String}             [content]          Ticket's content
   * @apiSuccess  {ObjectID}           [complainantEmail] Ticket's complainant's email 
   * @apiSuccess  {Object}             [dateSubmitted]    Ticket's date submitted
   * @apiSuccess  {Object}             [dateClosed]       Ticket's date closed
   * @apiSuccess  {String}             [status]           Ticket's status
   * @apiSuccess  {String}             [severityLevel]    Ticket's severityLevel
   * @apiSuccess  {Object}             [report]           Ticket's report
   * @apiSuccess  {String}             [emailOption]      Ticket's email's option
   * 
   * @apiError (Not Found 404)    NotFound     Ticket does not exist
   */
  .get(controller.get)
  
  /**
   * @api {patch} v1/tickets/:id Update Ticket
   * @apiDescription Update some fields of a ticket document
   * @apiVersion 1.0.0
   * @apiName UpdateTicket
   * @apiGroup Ticket
   * @apiPermission ticket
   *
   * @apiParam  {String}             [name]             Ticket's title
   * @apiParam  {String}             [type]             Ticket's type
   * @apiParam  {String}             [category]         Ticket's category
   * @apiParam  {String}             [content]          Ticket's content
   * @apiParam  {ObjectID}           [complainantEmail] Ticket's complainant's email 
   * @apiParam  {Object}             [dateSubmitted]    Ticket's date submitted
   * @apiParam  {Object}             [dateClosed]       Ticket's date closed
   * @apiParam  {String}             [status]           Ticket's status
   * @apiParam  {String}             [severityLevel]    Ticket's severityLevel
   * @apiParam  {Object}             [report]           Ticket's report
   * @apiParam  {String}             [emailOption]      Ticket's email's option
   *
   * @apiSuccess  {String}             [name]             Ticket's title
   * @apiSuccess  {String}             [type]             Ticket's type
   * @apiSuccess  {String}             [category]         Ticket's category
   * @apiSuccess  {String}             [content]          Ticket's content
   * @apiSuccess  {ObjectID}           [complainantEmail] Ticket's complainant's email 
   * @apiSuccess  {Object}             [dateSubmitted]    Ticket's date submitted
   * @apiSuccess  {Object}             [dateClosed]       Ticket's date closed
   * @apiSuccess  {String}             [status]           Ticket's status
   * @apiSuccess  {String}             [severityLevel]    Ticket's severityLevel
   * @apiSuccess  {Object}             [report]           Ticket's report
   * @apiSuccess  {String}             [emailOption]      Ticket's email's option
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Not Found 404)    NotFound     Ticket does not exist
   */
  .patch(controller.update)
  /**
   * @api {delete} v1/tickets/:id Delete Ticket
   * @apiDescription Delete a ticket
   * @apiVersion 1.0.0
   * @apiName DeleteTicket
   * @apiGroup Ticket
   * @apiPermission admin/investigator
   *
   * @apiHeader {String} Authorization   Ticket's access token
   *
   * @apiSuccess (No Content 204)  Successfully deleted
   *
   * @apiError (Unauthorized 401) Unauthorized  Only authenticated tickets can delete the data
   * @apiError (Forbidden 403)    Forbidden     Only ticket with same id or admins can delete the data
   * @apiError (Not Found 404)    NotFound      Ticket does not exist
   */
  .delete(controller.remove);

  router
    .route('/upload/:ticketID')
   /**
   * @api {post} v1/upload/:id Upload the report for Ticket
   * @apiDescription Upload the report for ticket
   * @apiVersion 1.0.0
   * @apiName UplloadReportTicket
   * @apiGroup Ticket
   * @apiPermission admin/investigator
   *
   * @apiParam    {Object}             [report]           Ticket's report
   *
   * @apiSuccess  {Object}             [report]           Ticket's report
   *   
   * @apiError (Not Found 404)    NotFound      Ticket does not exist
   */
    .post(controller.upload)

    /**
   * @api {get} v1/upload/:id Download the report
   * @apiDescription Download the report for ticket
   * @apiVersion 1.0.0
   * @apiName DownloadReport
   * @apiGroup Ticket
   * @apiPermission admin/investigator
   *
   * @apiParam    {Object}             [report]           Ticket's report
   *
   * @apiSuccess  {Object}             [report]           Ticket's report
   *   
   * @apiError (Not Found 404)      NotFound          Ticket does not exist
   */
  .get(controller.download)


module.exports = router;
