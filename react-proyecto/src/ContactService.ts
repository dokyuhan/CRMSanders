import axios from 'axios';

const API_URL = 'http://localhost:3003/contacts';

export const getContacts = async () => {
  return await axios.get(API_URL);
};

export const getContact = async (id: number) => {
  return await axios.get(`${API_URL}/${id}`);
};

export const createContact = async (data: any) => {
  return await axios.post(API_URL, data);
};

export const updateContact = async (id: number, data: any) => {
  return await axios.put(`${API_URL}/${id}`, data);
};

export const deleteContact = async (id: number) => {
  return await axios.delete(`${API_URL}/${id}`);
};
