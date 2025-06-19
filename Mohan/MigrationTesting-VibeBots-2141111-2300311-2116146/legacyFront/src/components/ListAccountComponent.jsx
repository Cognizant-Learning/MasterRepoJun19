import React, { useEffect, useState } from 'react';
import { getAccounts, creditAccount, debitAccount } from '../services/AccountService'; // Adjust the import path as necessary

const ListAccountComponent = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    getAccounts()
      .then(response => setAccounts(response.data))
      .catch(error => console.error('Error fetching accounts:', error));
  }, [accounts]);


  const handleCredit = (id) => {
    const amount = prompt('Enter credit amount:');
    if (amount && !isNaN(amount)) {
      creditAccount(id, amount)
        .then(() => {
          getAccounts(); // Refresh the list after credit
        })
        .catch(error => {
            console.error('Error crediting account:', error);
            alert('Credit operation failed. Please try again.');
    });
    }
  };

  const handleDebit = (id) => {
    const amount = prompt('Enter debit amount:');
    if (amount && !isNaN(amount)) {
      debitAccount(id, amount)
        .then(() => {
          getAccounts(); // Refresh the list after debit
        })
        .catch(error => {
            console.error('Error debiting account:', error);
            alert('debit operation failed. Please try again.');
        });
    }
  };

  return (
    <div className="container mt-4">
      <h2>Account List</h2>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Account Number</th>
            <th>Balance</th>
            <th>Actions</th> {/* Added Actions column */}
          </tr>
        </thead>
        <tbody>
          {accounts.map(account => (
            <tr key={account.id}>
              <td>{account.id}</td>
              <td>{account.accountNumber}</td>
              <td>{account.balance}</td>
              <td>
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={() => handleCredit(account.id)}
                >
                  Credit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDebit(account.id)}
                >
                  Debit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListAccountComponent;