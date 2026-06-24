const twilio = require('twilio');

// Credentials provided by the user
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

exports.makeCall = async (req, res) => {
  const { to } = req.body;

  if (!to) {
    return res.status(400).json({ 
      success: false, 
      error: 'Destination phone number is required.' 
    });
  }

  if (!to.startsWith('+91')) {
    return res.status(400).json({
      success: false,
      error: 'Only numbers starting with +91 are allowed.'
    });
  }

  try {
    const call = await client.calls.create({
      record: true,
      url: "http://demo.twilio.com/docs/voice.xml",
      to: to,
      from: "+12408203188",
    });

    console.log(`Twilio call initiated successfully. Call SID: ${call.sid}`);
    return res.status(200).json({ 
      success: true, 
      callSid: call.sid 
    });
  } catch (error) {
    console.error('Twilio Call Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to initiate Twilio call.' 
    });
  }
};

exports.endCall = async (req, res) => {
  const { callSid } = req.body;

  if (!callSid) {
    return res.status(400).json({ success: false, error: 'Call SID is required.' });
  }

  try {
    // Try to update status, but if already completed it will throw
    const call = await client.calls(callSid).update({ status: 'completed' });
    console.log(`Twilio call ended successfully. Call SID: ${call.sid}`);
    return res.status(200).json({ success: true, callSid: call.sid });
  } catch (error) {
    // If the error indicates it's already completed or not in-progress, we shouldn't fail
    if (error.status === 400 || error.message.includes('not in-progress')) {
      console.log(`Twilio call already ended or not in-progress. Call SID: ${callSid}`);
      return res.status(200).json({ success: true, callSid: callSid, message: 'Already ended' });
    }
    console.error('Twilio End Call Error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to end Twilio call.' });
  }
};

exports.getCallStatus = async (req, res) => {
  const { callSid } = req.params;

  if (!callSid) {
    return res.status(400).json({ success: false, error: 'Call SID is required.' });
  }

  try {
    const call = await client.calls(callSid).fetch();
    return res.status(200).json({ success: true, status: call.status });
  } catch (error) {
    console.error('Twilio Get Call Status Error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to fetch Twilio call status.' });
  }
};
