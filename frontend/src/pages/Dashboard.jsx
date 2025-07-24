import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

const Dashboard = () => {
  const [overview, setOverview] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); 
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/stock-overview", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          setOverview(res.data.overview);
        }
      } catch (err) {
        console.error("Failed to fetch stock overview:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
        {loading && <Spinner />} 
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Inventory Dashboard
        </h1>
        <button
          onClick={() => navigate("/transactions")}
          className="text-blue-600 hover:underline mt-4"
        >
          View Transactions
        </button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700">
              Total Products
            </h2>
            <p className="mt-2 text-2xl font-bold text-blue-600">
              {overview.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700">
              Total Batches
            </h2>
            <p className="mt-2 text-2xl font-bold text-green-600">
              {overview.reduce((acc, item) => acc + item.batch_count, 0)}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700">
              Total Stock Value
            </h2>
            <p className="mt-2 text-2xl font-bold text-red-600">
              ₹
              {overview
                .reduce(
                  (acc, item) => acc + parseFloat(item.total_stock_value),
                  0
                )
                .toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Live Stock Table
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-2 font-semibold text-gray-600">
                    Product ID
                  </th>
                  <th className="px-4 py-2 font-semibold text-gray-600">
                    Name
                  </th>
                  <th className="px-4 py-2 font-semibold text-gray-600">
                    Available Quantity
                  </th>
                  <th className="px-4 py-2 font-semibold text-gray-600">
                    Stock Value (₹)
                  </th>
                  <th className="px-4 py-2 font-semibold text-gray-600">
                    Batch Count
                  </th>
                </tr>
              </thead>
              <tbody>
                {overview.map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{item.product_id}</td>
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2">
                      {item.total_quantity_available}
                    </td>
                    <td className="px-4 py-2">₹{item.total_stock_value}</td>
                    <td className="px-4 py-2">{item.batch_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
