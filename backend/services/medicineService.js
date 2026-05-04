import Medicine from '../models/medicineModel.js';

/**
 * Service to handle Medicine operations
 */
export const fetchMedicinesByKeyword = async (keywordQuery = {}) => {
  return await Medicine.find(keywordQuery);
};

export const createMedicine = async (medicineData) => {
  const medicine = new Medicine(medicineData);
  return await medicine.save();
};

export const deleteMedicineById = async (id) => {
  return await Medicine.findByIdAndDelete(id);
};
