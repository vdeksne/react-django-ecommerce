import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { publicApiInstance } from "../../utils/axios";
import Swal from "sweetalert2";

function Invoice() {
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
          text: "Failed to load invoice details. Please try again.",
        });
      }
    };

    fetchOrderDetails();
  }, [order_oid]);

  const handlePrint = () => {
    window.print();
  };

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
        <h2>Invoice Not Found</h2>
        <p>The invoice you're looking for doesn't exist or has been removed.</p>
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
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="card-title">Invoice</h2>
                <button onClick={handlePrint} className="btn btn-primary">
                  <i className="fas fa-print me-2"></i>Print Invoice
                </button>
              </div>

              <div className="row mb-4">
                <div className="col-md-6">
                  <h5>Order Information</h5>
                  <p>
                    <strong>Order ID:</strong> {order.oid}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Status:</strong> {order.order_status}
                  </p>
                  <p>
                    <strong>Payment Status:</strong> {order.payment_status}
                  </p>
                </div>
                <div className="col-md-6">
                  <h5>Customer Information</h5>
                  <p>
                    <strong>Name:</strong> {order.full_name}
                  </p>
                  <p>
                    <strong>Email:</strong> {order.email}
                  </p>
                  <p>
                    <strong>Mobile:</strong> {order.mobile}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <h5>Shipping Address</h5>
                <p>{order.address}</p>
                <p>
                  {order.city}, {order.state}
                </p>
                <p>{order.country}</p>
              </div>

              <div className="table-responsive mb-4">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.cart_order_items?.map((item) => (
                      <tr key={item.id}>
                        <td>{item.product.title}</td>
                        <td>{item.qty}</td>
                        <td>${Number(item.price).toFixed(2)}</td>
                        <td>
                          ${(Number(item.price) * Number(item.qty)).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="row justify-content-end">
                <div className="col-md-4">
                  <table className="table">
                    <tbody>
                      <tr>
                        <td>
                          <strong>Subtotal:</strong>
                        </td>
                        <td className="text-end">
                          ${Number(order.sub_total).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Shipping:</strong>
                        </td>
                        <td className="text-end">
                          ${Number(order.shipping_amount).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Tax:</strong>
                        </td>
                        <td className="text-end">
                          ${Number(order.tax_fee).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Service Fee:</strong>
                        </td>
                        <td className="text-end">
                          ${Number(order.service_fee).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Discount:</strong>
                        </td>
                        <td className="text-end">
                          -${Number(order.saved).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Total:</strong>
                        </td>
                        <td className="text-end">
                          <strong>${Number(order.total).toFixed(2)}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-4 text-center">
                <Link to="/" className="btn btn-primary me-2">
                  Continue Shopping
                </Link>
                <button onClick={handlePrint} className="btn btn-secondary">
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Invoice;
