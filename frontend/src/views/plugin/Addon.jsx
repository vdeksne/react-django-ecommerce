import React from "react";

// Utility functions for handling product addons and variations

/**
 * Get the price of a product variation
 * @param {Object} variation - The variation object
 * @returns {number} The price of the variation
 */
const getVariationPrice = (variation) => {
  if (!variation) return 0;
  return variation.price || 0;
};

/**
 * Get the stock quantity of a product variation
 * @param {Object} variation - The variation object
 * @returns {number} The stock quantity of the variation
 */
const getVariationStock = (variation) => {
  if (!variation) return 0;
  return variation.stock_qty || 0;
};

/**
 * Check if a variation is in stock
 * @param {Object} variation - The variation object
 * @returns {boolean} Whether the variation is in stock
 */
const isVariationInStock = (variation) => {
  return getVariationStock(variation) > 0;
};

/**
 * Get the total price of a product with its variations
 * @param {Object} product - The product object
 * @param {Object} selectedVariation - The selected variation object
 * @returns {number} The total price
 */
const getTotalPrice = (product, selectedVariation) => {
  const basePrice = product.price || 0;
  const variationPrice = getVariationPrice(selectedVariation);
  return basePrice + variationPrice;
};

/**
 * Get the default variation for a product
 * @param {Object} product - The product object
 * @returns {Object|null} The default variation or null if none exists
 */
const getDefaultVariation = (product) => {
  if (!product?.variations || product.variations.length === 0) return null;
  return product.variations[0];
};

/**
 * Get the default color for a product
 * @param {Object} product - The product object
 * @returns {string} The default color
 */
const getDefaultColor = (product) => {
  if (!product?.colors || product.colors.length === 0) return "";
  return product.colors[0];
};

/**
 * Get the default size for a product
 * @param {Object} product - The product object
 * @returns {string} The default size
 */
const getDefaultSize = (product) => {
  if (!product?.sizes || product.sizes.length === 0) return "";
  return product.sizes[0];
};

const Addon = {
  getVariationPrice,
  getVariationStock,
  isVariationInStock,
  getTotalPrice,
  getDefaultVariation,
  getDefaultColor,
  getDefaultSize,
};

export default Addon;
