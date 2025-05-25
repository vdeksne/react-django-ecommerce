import { React, useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import { publicApiInstance } from "../../utils/axios";
import UserData from "../plugin/UserData";
import { CartContext } from "../plugin/Context";
import Swal from "sweetalert2";

function Checkout() {
  const { cart_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    country: "",
  });

  const publicAxios = publicApiInstance;
  const userData = UserData();
  const cartContext = useContext(CartContext);
  const setCartCount = cartContext[1];

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const url = userData?.user_id
          ? `cart-list/${cart_id}/${userData?.user_id}/`
          : `cart-list/${cart_id}/`;
        const response = await publicAxios.get(url);

        // Calculate totals
        let subtotalSum = 0;
        let shippingSum = 0;
        response.data.forEach((item) => {
          subtotalSum += Number(item.price) * Number(item.qty);
          shippingSum += Number(item.shipping_amount) || 0;
        });

        setSubtotal(subtotalSum);
        setShipping(shippingSum);
        setTotal(subtotalSum + shippingSum);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load cart items. Please try again.",
        });
      }
    };

    fetchCartItems();
  }, [cart_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await publicAxios.post("create-order/", {
        ...formData,
        cart_id,
        user_id: userData?.user_id || 0,
      });

      if (response.data.order_oid) {
        Swal.fire({
          icon: "success",
          title: "Order Created Successfully",
          text: "Redirecting to payment...",
        });
        // Clear cart
        setCartCount(0);
        // Redirect to payment page or success page
        navigate(`/payment-success/${response.data.order_oid}`);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Failed to create order. Please try again.",
      });
    }
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

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Checkout</h2>
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Shipping Information</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="full_name" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="mobile" className="form-label">
                    Mobile
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="city" className="form-label">
                    City
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="state" className="form-label">
                    State
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="country" className="form-label">
                    Country
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Place Order
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Order Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${Number(subtotal).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>${Number(shipping).toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong>${Number(total).toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
