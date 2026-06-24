const FollowUp = require('../models/followUpModel');

// @desc    Get all follow-ups
// @route   GET /api/followups
// @access  Public
const getFollowUps = async (req, res) => {
  try {
    const followUps = await FollowUp.find().sort({ scheduledAt: 1 });
    res.json({ success: true, followUps });
  } catch (error) {
    console.error('Error fetching follow-ups:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create a follow-up
// @route   POST /api/followups
// @access  Public
const createFollowUp = async (req, res) => {
  try {
    const followUp = await FollowUp.create(req.body);
    res.status(201).json({ success: true, followUp });
  } catch (error) {
    console.error('Error creating follow-up:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update a follow-up
// @route   PUT /api/followups/:id
// @access  Public
const updateFollowUp = async (req, res) => {
  try {
    const followUp = await FollowUp.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!followUp) {
      return res.status(404).json({ success: false, error: 'Follow-up not found' });
    }

    res.json({ success: true, followUp });
  } catch (error) {
    console.error('Error updating follow-up:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete a follow-up
// @route   DELETE /api/followups/:id
// @access  Public
const deleteFollowUp = async (req, res) => {
  try {
    const followUp = await FollowUp.findByIdAndDelete(req.params.id);

    if (!followUp) {
      return res.status(404).json({ success: false, error: 'Follow-up not found' });
    }

    res.json({ success: true, message: 'Follow-up removed' });
  } catch (error) {
    console.error('Error deleting follow-up:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  getFollowUps,
  createFollowUp,
  updateFollowUp,
  deleteFollowUp,
};
