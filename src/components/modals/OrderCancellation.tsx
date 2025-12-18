import React from "react";
import { Modal } from "@mui/material";
import type { Notification } from "../../../hooks/useNotification";

interface OrderCancellationProps {
  notification: Notification;
  onClose: () => void;
  onAction: (id: string, action: "accept" | "reject") => Promise<void>;
}

const OrderCancellation: React.FC<OrderCancellationProps> = ({
  notification,
  onClose,
  onAction,
}) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    deliveryAddress,
    paymentMethod,
    totalOrder,
    notes,
    payment,
    items,
    orderId,
  } = notification;

  return (
    <Modal open={true} onClose={onClose}>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto p-6 overflow-y-auto max-h-[90vh] relative">
          {/* Header */}
          <div className="flex flex-row justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Cancellation Request
            </h2>
            <img
              src="/images/icons/close.png"
              alt="Close"
              className="w-4 h-4 cursor-pointer absolute top-5 right-4"
              onClick={onClose}
            />
          </div>

          {/* Customer Info */}
          <div className="mb-4 space-y-1">
            <p className="text-sm text-gray-700">
              <strong>Customer:</strong> {customerName}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Email:</strong> {customerEmail}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Phone:</strong> {customerPhone}
            </p>
          </div>

          {/* Order Summary */}
          <div className="mb-4 space-y-1">
            <p className="text-sm text-gray-700">
              <strong>Delivery Address:</strong> {deliveryAddress}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Payment Method:</strong> {paymentMethod}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Total:</strong> ₱{totalOrder}
            </p>
            {notes && (
              <p className="text-sm text-gray-700">
                <strong>Notes:</strong> {notes}
              </p>
            )}
          </div>

          {/* Cancellation Info */}
          {payment?.cancellationStatus === "Requested" && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">
                <strong>Status:</strong> {payment.cancellationStatus}
              </p>
              {payment.cancellationReason && (
                <p className="text-sm text-red-700">
                  <strong>Reason:</strong> {payment.cancellationReason}
                </p>
              )}
            </div>
          )}

          {/* Product Details */}
          {items && items.length > 0 && (
            <div className="mb-6 space-y-4">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 border-b border-gray-100 pb-4"
                >
                  <img
                    src={
                      item.product?.image || "https://via.placeholder.com/80"
                    }
                    alt={item.product?.productName || "Product"}
                    className="w-30 h-30 object-cover rounded-md border"
                  />
                  <div className="flex flex-col gap-1 flex-1">
                    <p className="text-base font-medium text-gray-900">
                      {item.product?.productName}
                    </p>
                    {item.product?.specification && (
                      <p className="text-sm text-gray-600">
                        {item.product.specification}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                    {item.product?.price && (
                      <p className="text-sm text-gray-600">
                        Price: ₱{item.product.price}
                      </p>
                    )}
                    <p className="text-base font-medium">
                      Status:{" "}
                      <span className="font-semibold text-green-600">
                        {item.status}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                onAction(orderId, "accept");
                onClose();
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              Accept
            </button>
            <button
              onClick={() => {
                onAction(orderId, "reject");
                onClose();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OrderCancellation;
