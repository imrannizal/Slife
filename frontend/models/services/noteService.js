import axios from 'axios';

const BASE_URL = 'https://your-api-url.com/api/notes';

export const getNotes = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const createNote = async (note) => {
  const response = await axios.post(BASE_URL, note);
  return response.data;
};

export const updateNote = async (id, updatedFields) => {
  const response = await axios.put(`${BASE_URL}/${id}`, updatedFields);
  return response.data;
};

export const deleteNote = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};