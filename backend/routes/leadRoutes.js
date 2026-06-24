const express = require('express');
const router = express.Router();
const { getLeads, createLead, updateLead, deleteLead } = require('../controllers/leadController');

router.route('/leads')
  .get(getLeads)
  .post(createLead);

router.route('/leads/:id')
  .put(updateLead)
  .delete(deleteLead);

module.exports = router;
