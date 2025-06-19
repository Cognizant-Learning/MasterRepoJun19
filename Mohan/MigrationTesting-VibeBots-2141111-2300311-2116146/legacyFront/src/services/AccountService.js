import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/accounts'; // Change to your backend URL

export const getAccounts = () => axios.get(API_BASE_URL);
export const getAccountById = (id) => axios.get(`${API_BASE_URL}/${id}`);
export const createAccount = (account) => axios.post(API_BASE_URL, account);
export const creditAccount = (id, amount) => axios.post(`${API_BASE_URL}/${id}/credit?amount=${amount}`);
export const debitAccount = (id, amount) => axios.post(`${API_BASE_URL}/${id}/debit?amount=${amount}`);