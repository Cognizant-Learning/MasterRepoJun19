import axios from 'axios';

const API_URL = 'http://localhost:8080/api/accounts';

// For simplicity, we'll use account ID 1 throughout the app
const DEFAULT_ACCOUNT_ID = 1;

class AccountService {
    async getBalance() {
        return await axios.get(`${API_URL}/${DEFAULT_ACCOUNT_ID}`);
    }
    
    async creditAccount(amount) {
        return await axios.post(`${API_URL}/${DEFAULT_ACCOUNT_ID}/credit`, { amount });
    }
    
    async debitAccount(amount) {
        return await axios.post(`${API_URL}/${DEFAULT_ACCOUNT_ID}/debit`, { amount });
    }
    
    async initializeAccount() {
        return await axios.post(`${API_URL}/initialize`);
    }
}

export default new AccountService();
