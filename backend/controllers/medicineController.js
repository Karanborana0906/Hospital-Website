import { fetchMedicinesByKeyword, createMedicine } from '../services/medicineService.js';

// @desc    Get all medicines (with optional search query)
// @route   GET /api/medicines
// @access  Public
export const getMedicines = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const medicines = await fetchMedicinesByKeyword(keyword);
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add a new medicine (Admin only)
// @route   POST /api/medicines
// @access  Private/Admin
export const addMedicine = async (req, res) => {
  try {
    const createdMedicine = await createMedicine(req.body);
    res.status(201).json(createdMedicine);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
