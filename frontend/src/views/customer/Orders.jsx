import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { publicApiInstance } from "../../utils/axios";
import Swal from "sweetalert2";
import Sidebar from "./Sidebar";

function Orders() {
  const { user_id } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const publicAxios = publicApiInstance;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await publicAxios.get(`customer/orders/${user_id}/`);
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load orders. Please try again.",
        });
      }
    };

    fetchOrders();
  }, [user_id]);

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

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-3">
          <Sidebar />
        </div>
        <div className="col-md-9">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">My Orders</h2>
              {orders.length === 0 ? (
                <div className="text-center py-5">
                  <h4>No orders found</h4>
                  <p>You haven't placed any orders yet.</p>
                  <Link to="/shop" className="btn btn-primary">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Payment</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.oid}>
                          <td>#{order.oid}</td>
                          <td>{new Date(order.date).toLocaleDateString()}</td>
                          <td>${Number(order.total).toFixed(2)}</td>
                          <td>
                            <span
                              className={`badge ${
                                order.order_status === "Delivered"
                                  ? "bg-success"
                                  : order.order_status === "Processing"
                                    ? "bg-warning"
                                    : "bg-info"
                              }`}
                            >
                              {order.order_status}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                order.payment_status === "paid"
                                  ? "bg-success"
                                  : "bg-danger"
                              }`}
                            >
                              {order.payment_status}
                            </span>
                          </td>
                          <td>
                            <Link
                              to={`/account/${user_id}/orders/${order.oid}`}
                              className="btn btn-sm btn-primary"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;
