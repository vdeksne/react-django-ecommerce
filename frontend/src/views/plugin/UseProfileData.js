import { useState, useEffect } from "react";
import { publicApiInstance } from "../../utils/axios";
import Swal from "sweetalert2";

const UseProfileData = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const publicAxios = publicApiInstance;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user_id = localStorage.getItem("user_id");
        if (!user_id) {
          setLoading(false);
          return;
        }

        const response = await publicAxios.get(`customer/profile/${user_id}/`);
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load profile data. Please try again.",
        });
      }
    };

    fetchProfile();
  }, []);

  const updateProfile = async (formData) => {
    try {
      const user_id = localStorage.getItem("user_id");
      if (!user_id) {
        throw new Error("User not authenticated");
      }

      const response = await publicAxios.put(
        `customer/profile/${user_id}/`,
        formData
      );
      setProfile(response.data);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Profile updated successfully!",
      });
      return response.data;
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update profile. Please try again.",
      });
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
  };
};

export default UseProfileData;
