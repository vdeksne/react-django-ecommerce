import apiInstance from "../../utils/axios";

/**
 * Add a product to the cart
 * @param {string} product_id - The ID of the product to add
 * @param {string} user_id - The ID of the user
 * @param {number} qty - The quantity to add
 * @param {number} price - The price of the product
 * @param {number} shipping_amount - The shipping amount
 * @param {string} country - The country code
 * @param {string} color - The selected color
 * @param {string} size - The selected size
 * @param {string} cart_id - The cart ID
 * @param {Function} setIsAddingToCart - Function to update loading state
 * @returns {Promise} The API response
 */
export const addToCart = async (
  product_id,
  user_id,
  qty,
  price,
  shipping_amount,
  country,
  color,
  size,
  cart_id,
  setIsAddingToCart
) => {
  try {
    setIsAddingToCart(true);

    const response = await apiInstance.post("cart/", {
      product_id,
      user_id,
      qty,
      price,
      shipping_amount,
      country,
      color,
      size,
      cart_id,
    });

    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  } finally {
    setIsAddingToCart(false);
  }
};

/**
 * Update cart item quantity
 * @param {string} cart_item_id - The ID of the cart item to update
 * @param {number} qty - The new quantity
 * @returns {Promise} The API response
 */
export const updateCartItem = async (cart_item_id, qty) => {
  try {
    const response = await apiInstance.patch(`cart/${cart_item_id}/`, {
      qty,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};

/**
 * Remove item from cart
 * @param {string} cart_item_id - The ID of the cart item to remove
 * @returns {Promise} The API response
 */
export const removeFromCart = async (cart_item_id) => {
  try {
    const response = await apiInstance.delete(`cart/${cart_item_id}/`);
    return response.data;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
};

export default {
  addToCart,
  updateCartItem,
  removeFromCart,
};
