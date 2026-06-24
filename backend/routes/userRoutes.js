const express = require('express');
const router = express.Router();
const { loginUser, signupUser, getUsers, updateUserRole } = require('../controllers/userController');
const { makeCall, endCall, getCallStatus } = require('../controllers/callController');
const { saveCallLog, getCallLogs } = require('../controllers/callLogController');
const { adminAuth } = require('../middleware/auth');

// Map auth endpoints
router.post('/login', loginUser);
router.post('/signup', signupUser);

// Calling endpoint
router.post('/make-call', makeCall);
router.post('/end-call', endCall);
router.get('/call-status/:callSid', getCallStatus);
router.post('/call-logs', saveCallLog);
router.get('/call-logs', getCallLogs);

// Admin endpoints
router.get('/users', adminAuth, getUsers);
router.put('/users/:id/role', adminAuth, updateUserRole);

module.exports = router;
