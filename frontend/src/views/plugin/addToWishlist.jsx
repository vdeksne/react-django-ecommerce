import React from "react";
import apiInstance from "../../utils/axios";
// import { useState } from "react";
import Swal from "sweetalert2";

/**
 * Add a product to the user's wishlist
 * @param {string} productId - The ID of the product to add to wishlist
 * @param {string} userId - The ID of the user
 * @returns {Promise} The API response
 */
export const addToWishlist = async (productId, userId) => {
  const axios = apiInstance;

  try {
    // Create a new FormData object to send product information to the server
    const formData = new FormData();
    formData.append("product_id", productId);
    formData.append("user_id", userId);

    // Send a POST request to the server's 'customer/wishlist/create/' endpoint with the product information
    const response = await axios.post("customer/wishlist/create/", formData);

    // Show success message
    Swal.fire({
      icon: "success",
      title: response.data.message || "Product added to wishlist",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    return response.data;
  } catch (error) {
    // Log any errors that occur during the request
    console.error("Error adding to wishlist:", error);

    // Show error message
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error.response?.data?.message || "Failed to add product to wishlist",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    throw error;
  }
};

/**
 * Remove a product from the user's wishlist
 * @param {string} productId - The ID of the product to remove from wishlist
 * @param {string} userId - The ID of the user
 * @returns {Promise} The API response
 */
export const removeFromWishlist = async (productId, userId) => {
  const axios = apiInstance;

  try {
    const response = await axios.delete(
      `customer/wishlist/delete/${productId}/${userId}/`
    );

    Swal.fire({
      icon: "success",
      title: "Product removed from wishlist",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error removing from wishlist:", error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error.response?.data?.message ||
        "Failed to remove product from wishlist",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    throw error;
  }
};

export default {
  addToWishlist,
  removeFromWishlist,
};
