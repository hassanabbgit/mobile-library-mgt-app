import api from './axios';

export const getBooks = async () => {
  const res = await api.get('/books/get-books');
  return res.data;
};

export const searchBooks = async (query: string) => {
  const res = await api.get(`/books/search-books?q=${query}`);
  return res.data;
};
