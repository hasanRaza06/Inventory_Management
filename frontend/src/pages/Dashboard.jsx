import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import TransactionModal from "../components/TransactionModal";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const socket = io("http://localhost:5000");

const Dashboard = () => {
  const [overview, setOverview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [transactionType, setTransactionType] = useState("");
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
    });

    socket.on("stock_updated", (data) => {
      console.log("🔄 Real-time update received:", data);
      fetchData();
    });

    return () => {
      socket.off("stock_updated");
      socket.disconnect();
    };
  }, []);

  const openModal = (product, type) => {
    setSelectedProduct(product);
    setTransactionType(type);
    setModalOpen(true);
  };

  const handleTransaction = async (payload) => {
    if (payload.event_type === "sale") {
      const available = selectedProduct?.total_quantity_available || 0;
      if (payload.quantity > available) {
        toast.error("Sale quantity cannot exceed available stock.");
        return;
      }
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/simulate",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
      }

      setModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Transaction failed:", error);
      toast.error("Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  const chartData = overview.map((item) => ({
    name: item.name,
    stockValue: parseFloat(item.total_stock_value),
    quantity: item.total_quantity_available,
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
      {loading && <Spinner />}
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Inventory Dashboard
        </h1>

        <button
          onClick={() => navigate("/transactions")}
          className="text-blue-600 hover:underline mt-4 mb-6"
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

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Stock Overview Chart
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="stockValue"
                stroke="#8884d8"
                name="Stock Value (₹)"
              />
              <Line
                type="monotone"
                dataKey="quantity"
                stroke="#82ca9d"
                name="Available Quantity"
              />
            </LineChart>
          </ResponsiveContainer>
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
                    Avg. Unit Cost (₹)
                  </th>
                  <th className="px-4 py-2 font-semibold text-gray-600">
                    Batch Count
                  </th>
                  <th className="px-4 py-2 font-semibold text-gray-600">
                    Actions
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
                    <td className="px-4 py-2">
                      {item.total_quantity_available > 0
                        ? `₹${(
                            parseFloat(item.total_stock_value) /
                            item.total_quantity_available
                          ).toFixed(2)}`
                        : "—"}
                    </td>
                    <td className="px-4 py-2">{item.batch_count}</td>
                    <td className="px-4 py-2">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal(item, "sale")}
                          className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Sell
                        </button>
                        <button
                          onClick={() => openModal(item, "purchase")}
                          className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Purchase
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleTransaction}
        type={transactionType}
        product={selectedProduct}
      />
    </div>
  );
};

export default Dashboard;
