const express = require('express');
const router = express.Router();
const { getFollowUps, createFollowUp, updateFollowUp, deleteFollowUp } = require('../controllers/followUpController');

router.route('/followups')
  .get(getFollowUps)
  .post(createFollowUp);

router.route('/followups/:id')
  .put(updateFollowUp)
  .delete(deleteFollowUp);

module.exports = router;
