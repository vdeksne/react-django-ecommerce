import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { publicApiInstance } from "../../utils/axios";

function PaymentSuccess() {
  const { order_oid } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const publicAxios = publicApiInstance;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await publicAxios.get(`checkout/${order_oid}/`);
        setOrder(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load order details. Please try again.",
        });
      }
    };

    fetchOrderDetails();
  }, [order_oid]);

  if (loading) {
    return (
      <div className="container text-center">
        <img
          src="https://cdn.dribbble.com/users/2046015/screenshots/5973727/06-loader_telega.gif"
          alt="Loading..."
        />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container text-center mt-5">
        <h2>Order Not Found</h2>
        <p>The order you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="btn btn-primary">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body text-center">
              <div className="mb-4">
                <i
                  className="fas fa-check-circle text-success"
                  style={{ fontSize: "4rem" }}
                ></i>
              </div>
              <h2 className="card-title">Payment Successful!</h2>
              <p className="card-text">Thank you for your order.</p>
              <div className="order-details mt-4">
                <h4>Order Details</h4>
                <p>
                  <strong>Order ID:</strong> {order.oid}
                </p>
                <p>
                  <strong>Total Amount:</strong> $
                  {Number(order.total).toFixed(2)}
                </p>
                <p>
                  <strong>Status:</strong> {order.order_status}
                </p>
                <p>
                  <strong>Payment Status:</strong> {order.payment_status}
                </p>
              </div>
              <div className="shipping-details mt-4">
                <h4>Shipping Information</h4>
                <p>
                  <strong>Name:</strong> {order.full_name}
                </p>
                <p>
                  <strong>Email:</strong> {order.email}
                </p>
                <p>
                  <strong>Mobile:</strong> {order.mobile}
                </p>
                <p>
                  <strong>Address:</strong> {order.address}
                </p>
                <p>
                  <strong>City:</strong> {order.city}
                </p>
                <p>
                  <strong>State:</strong> {order.state}
                </p>
                <p>
                  <strong>Country:</strong> {order.country}
                </p>
              </div>
              <div className="mt-4">
                <Link to="/" className="btn btn-primary me-2">
                  Continue Shopping
                </Link>
                <Link
                  to={`/invoice/${order.oid}`}
                  className="btn btn-secondary"
                >
                  View Invoice
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
