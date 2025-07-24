import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';

const Transactions = () => {
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/ledger', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.success) {
          setLedger(res.data.ledger);
        }
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      }finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
        {loading && <Spinner />} 
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">All Transactions</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-x-auto border border-gray-200">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Product ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Unit Price / Total Cost</th>
                <th className="px-4 py-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((tx, index) => (
                <tr
                  key={index}
                  className={`border-b ${tx.type === 'purchase' ? 'bg-red-50' : 'bg-green-50'}`}
                >
                  <td className="px-4 py-2 font-medium text-gray-700">{tx.type.toUpperCase()}</td>
                  <td className="px-4 py-2">{tx.product_id}</td>
                  <td className="px-4 py-2">{tx.name}</td>
                  <td className="px-4 py-2">{tx.quantity}</td>
                  <td className="px-4 py-2">
                    {tx.type === 'purchase' ? `₹${tx.unit_price}` : `₹${tx.total_cost}`}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(tx.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
