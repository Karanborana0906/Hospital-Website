import Hospital from '../models/hospitalModel.js';

// @desc    Fetch all hospitals
// @route   GET /api/hospitals
// @access  Public
export const getHospitals = async (req, res) => {
  try {
    const { city } = req.query;
    let query = {};
    
    if (city) {
      query.city = new RegExp(city, 'i');
    }
    
    const hospitals = await Hospital.find(query);
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new hospital
// @route   POST /api/hospitals
// @access  Private/Admin
export const createHospital = async (req, res) => {
  try {
    const hospital = await Hospital.create(req.body);
    res.status(201).json(hospital);
  } catch (error) {
    res.status(400).json({ message: 'Invalid hospital data', error: error.message });
  }
};
