import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/sectors';

export const getSectors = async () => {
  const res = await axios.get(API_BASE);
  return res.data;
};

export const addOrUpdateSector = async (name, availability) => {
  const res = await axios.post(API_BASE, { name, availability });
  return res.data;
};

export const deleteSector = async (id) => {
  const res = await axios.delete(`${API_BASE}/${id}`);
  return res.data;
};

export const SECTOR_LIST = [
  'PO33','PO40','PO41','PO42','PO43','PO50','PO52','PO53','PO81','PO83','PO84',
  'PO51','PO85','PO86','PO88','PO89'
];
