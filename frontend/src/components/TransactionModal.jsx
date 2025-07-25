import React, { useState, useEffect } from "react";

const TransactionModal = ({ isOpen, onClose, onConfirm, type, product }) => {
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);

  useEffect(() => {
    setQuantity(1);
    setUnitPrice(0);
  }, [isOpen, type]);

  if (!isOpen || !product) return null;

  const handleConfirm = () => {
    const payload = {
      product_id: product.product_id,
      event_type: type,
      quantity: Number(quantity),
      unit_price: type === "purchase" ? Number(unitPrice) : 0,
      timestamp: new Date().toISOString(),
    };

    onConfirm(payload);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 capitalize">{type} Product</h2>
        <p className="text-sm mb-2 text-gray-700">
          Product: <span className="font-medium">{product.name}</span>
        </p>

        <label className="block text-sm font-medium text-gray-700 mt-2">
          Quantity
        </label>
        <input
          type="number"
          min={1}
          className="w-full mt-1 border rounded px-3 py-2"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        {type === "purchase" && (
          <>
            <label className="block text-sm font-medium text-gray-700 mt-2">
              Unit Price (₹)
            </label>
            <input
              type="number"
              min={1}
              className="w-full mt-1 border rounded px-3 py-2"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
            />
            <p className="mt-3 text-sm text-gray-600">
              Total Price: ₹{(quantity * unitPrice).toFixed(2)}
            </p>
          </>
        )}

        {type === "sale" && (
          <p className="mt-4 text-sm text-gray-600">
            Price will be calculated using FIFO batches.
          </p>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {type === "purchase" ? "Buy" : "Sell"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
