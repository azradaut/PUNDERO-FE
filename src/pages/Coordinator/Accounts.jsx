import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8515/api/Account/GetAccounts', {
          headers: {
            'my-auth-token': token,
          },
        });
        setAccounts(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {isLoading && <p>Loading accounts...</p>}
      {error && <p>Error fetching accounts: {error.message}</p>}
      {!isLoading && !error && (
        <ul>
          {accounts.map((account) => (
            <li key={account.idAccount}>
              {account.firstName} {account.lastName} ({account.email})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Accounts;