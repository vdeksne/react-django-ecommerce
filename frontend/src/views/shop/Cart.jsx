import { React, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { publicApiInstance } from "../../utils/axios";
import UserData from "../plugin/UserData";
import CartID from "../plugin/cartID";
import { CartContext } from "../plugin/Context";
import Swal from "sweetalert2";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);

  const publicAxios = publicApiInstance;
  const userData = UserData();
  let cart_id = CartID();
  const cartContext = useContext(CartContext);
  const setCartCount = cartContext[1];

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        // Use publicAxios for unauthenticated requests
        const url = userData?.user_id
          ? `cart-list/${cart_id}/${userData?.user_id}/`
          : `cart-list/${cart_id}/`;
        const response = await publicAxios.get(url);
        setCartItems(response.data);

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
        setCartCount(response.data.length);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setLoading(false);
        // Show error message to user
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load cart items. Please try again.",
        });
      }
    };

    fetchCartItems();
  }, []);

  const handleRemoveItem = async (itemId) => {
    try {
      // Use the correct endpoint with both cart_id and item_id
      await publicAxios.delete(`cart-delete/${cart_id}/${itemId}/`);

      // Update cart items immediately after successful deletion
      const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
      setCartItems(updatedCartItems);
      setCartCount(updatedCartItems.length);

      // Recalculate totals
      let subtotalSum = 0;
      let shippingSum = 0;
      updatedCartItems.forEach((item) => {
        subtotalSum += Number(item.price) * Number(item.qty);
        shippingSum += Number(item.shipping_amount) || 0;
      });

      setSubtotal(subtotalSum);
      setShipping(shippingSum);
      setTotal(subtotalSum + shippingSum);

      Swal.fire({
        icon: "success",
        title: "Item removed from cart",
      });
    } catch (error) {
      console.error("Error removing item:", error);
      // Show more detailed error message
      Swal.fire({
        icon: "error",
        title: "Error removing item",
        text: error.response?.data?.message || "Please try again later.",
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
      <h2 className="mb-4">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <h3>Your cart is empty</h3>
          <Link to="/products" className="btn btn-primary mt-3">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-8">
            {cartItems.map((item) => (
              <div key={item.id} className="card mb-3">
                <div className="row g-0">
                  <div className="col-md-4">
                    <img
                      src={item.image}
                      className="img-fluid rounded-start"
                      alt={item.title}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">{item.title}</h5>
                      <p className="card-text">
                        <small className="text-muted">
                          Color: {item.color} | Size: {item.size}
                        </small>
                      </p>
                      <p className="card-text">
                        Quantity: {item.qty} x ${item.price}
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">${item.price * item.qty}</h6>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <FaTrash /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
                <Link
                  to={`/checkout/${cart_id}`}
                  className="btn btn-primary w-100"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
