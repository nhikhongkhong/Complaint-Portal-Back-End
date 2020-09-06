const express = require('express');
const complainantRoutes = require('./complainant.route');
const ticketRoutes = require('./ticket.route 2');
const accountRoutes = require('./account.route');
const authRoutes = require('./auth.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));

router.use('/complainants', complainantRoutes);
router.use('/accounts', accountRoutes);
router.use('/tickets', ticketRoutes);
router.use('/auth', authRoutes);

module.exports = router;
