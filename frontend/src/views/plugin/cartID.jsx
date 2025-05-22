import { useState, useEffect } from "react";

/**
 * Hook to manage cart identification
 * @returns {string} The cart ID
 */
const CartID = () => {
  const [cartId, setCartId] = useState("");

  useEffect(() => {
    // Try to get existing cart ID from localStorage
    const existingCartId = localStorage.getItem("cart_id");

    if (existingCartId) {
      setCartId(existingCartId);
    } else {
      // Generate a new cart ID if none exists
      const newCartId = generateCartId();
      localStorage.setItem("cart_id", newCartId);
      setCartId(newCartId);
    }
  }, []);

  // Generate a unique cart ID
  const generateCartId = () => {
    return "cart_" + Math.random().toString(36).substr(2, 9);
  };

  return cartId;
};

export default CartID;
