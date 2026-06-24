const Lead = require('../models/leadModel');

// @desc    Get all leads
// @route   GET /api/leads
// @access  Public (for now)
const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json({ success: true, leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create a lead
// @route   POST /api/leads
// @access  Public
const createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json({ success: true, lead });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update a lead
// @route   PUT /api/leads/:id
// @access  Public
const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }

    res.json({ success: true, lead });
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Public
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }

    res.json({ success: true, message: 'Lead removed' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
};
