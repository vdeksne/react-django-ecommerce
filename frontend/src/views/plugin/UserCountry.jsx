import { useState, useEffect } from "react";
import apiInstance from "../../utils/axios";
import { useAuthStore } from "../../store/auth";

/**
 * Hook to get the user's current address and country information
 * @returns {Object} Object containing address data and loading state
 */
const GetCurrentAddress = () => {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        // Only fetch address if user is logged in
        if (isLoggedIn()) {
          const response = await apiInstance.get("address/");
          if (response.data && response.data.length > 0) {
            // Get the first address as default
            setAddress(response.data[0]);
          }
        }
      } catch (err) {
        setError(err.message || "Failed to fetch address");
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [isLoggedIn]);

  return {
    address,
    loading,
    error,
    // Helper functions
    getCountry: () => address?.country || "",
    getCity: () => address?.city || "",
    getStreet: () => address?.street || "",
    getPostalCode: () => address?.postal_code || "",
    getFullAddress: () => {
      if (!address) return "";
      return `${address.street}, ${address.city}, ${address.postal_code}, ${address.country}`;
    },
  };
};

export default GetCurrentAddress;
