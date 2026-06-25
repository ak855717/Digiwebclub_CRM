const express = require('express');
const router = express.Router();
const { getLeads, createLead, updateLead, deleteLead } = require('../controllers/leadController');
const { adminAuth } = require('../middleware/auth');

router.route('/leads')
  .get(getLeads)
  .post(createLead);

router.route('/leads/:id')
  .put(adminAuth, updateLead)
  .delete(adminAuth, deleteLead);

module.exports = router;
