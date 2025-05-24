import { useState, useEffect } from "react";

/**
 * Hook to manage cart identification
 * @returns {string} The cart ID
 */
const CartID = () => {
  // Initialize with a default cart ID
  const [cartId, setCartId] = useState(() => {
    // Try to get existing cart ID from localStorage
    const existingCartId = localStorage.getItem("cart_id");
    if (existingCartId) {
      return existingCartId;
    }
    // Generate a new cart ID if none exists
    const newCartId = "cart_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("cart_id", newCartId);
    return newCartId;
  });

  // Keep the useEffect for any future updates
  useEffect(() => {
    const existingCartId = localStorage.getItem("cart_id");
    if (existingCartId && existingCartId !== cartId) {
      setCartId(existingCartId);
    }
  }, []);

  return cartId;
};

export default CartID;
