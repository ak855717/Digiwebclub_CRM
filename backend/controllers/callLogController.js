const CallLog = require('../models/callLogModel');
const cloudinary = require('../config/cloudinary');
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

exports.saveCallLog = async (req, res) => {
  try {
    const { recipient, phoneNumber, duration, direction, status, callSid } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ success: false, error: 'Phone number is required' });
    }

    const newLog = new CallLog({
      recipient: recipient || 'Unknown',
      phoneNumber,
      duration: duration || 0,
      direction: direction || 'Outbound',
      status: status || 'Completed',
      callSid: callSid
    });

    await newLog.save();

    res.status(201).json({ success: true, data: newLog });

    // Background job to fetch and upload recording
    if (callSid) {
      setTimeout(async () => {
        try {
          console.log(`[Cloudinary Background Job] Checking recordings for Call SID: ${callSid}`);
          const recordings = await twilioClient.recordings.list({ callSid: callSid, limit: 1 });
          
          if (recordings && recordings.length > 0) {
            const recording = recordings[0];
            // The Twilio recording URL needs basic auth to access the audio file
            // Format: https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Recordings/{RecordingSid}.mp3
            const recordingUrl = `https://${accountSid}:${authToken}@api.twilio.com/2010-04-01/Accounts/${accountSid}/Recordings/${recording.sid}.mp3`;
            
            console.log(`[Cloudinary Background Job] Uploading to Cloudinary...`);
            
            const uploadResult = await cloudinary.uploader.upload(recordingUrl, {
              resource_type: 'video', // Audio is uploaded as 'video' in Cloudinary
              folder: 'crm_call_recordings'
            });

            console.log(`[Cloudinary Background Job] Upload successful: ${uploadResult.secure_url}`);
            
            // Update the call log with the Cloudinary URL
            await CallLog.findByIdAndUpdate(newLog._id, { recordingUrl: uploadResult.secure_url });
          } else {
            console.log(`[Cloudinary Background Job] No recording found for Call SID: ${callSid}`);
          }
        } catch (jobError) {
          console.error('[Cloudinary Background Job] Error:', jobError);
        }
      }, 20000); // 20 seconds delay to ensure Twilio has processed the recording
    }
  } catch (error) {
    console.error('Error saving call log:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.getCallLogs = async (req, res) => {
  try {
    const logs = await CallLog.find().sort({ createdAt: -1 }).limit(100);
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    console.error('Error fetching call logs:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
