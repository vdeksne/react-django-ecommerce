// Import the Axios library to make HTTP requests. Axios is a popular JavaScript library for this purpose.
import axios from "axios";
import { API_BASE_URL } from "./constants";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

// Create an instance of Axios for authenticated requests
const apiInstance = axios.create({
  // Set the base URL for this instance. All requests made using this instance will have this URL as their starting point.
  baseURL: API_BASE_URL,

  // Set a timeout for requests made using this instance. If a request takes longer than 5 seconds to complete, it will be canceled.
  timeout: 100000, // timeout after 5 seconds

  // Define headers that will be included in every request made using this instance. This is common for specifying the content type and accepted response type.
  headers: {
    "Content-Type": "application/json", // The request will be sending data in JSON format.
    Accept: "application/json", // The request expects a response in JSON format.
  },
});

// Create an instance of Axios for public requests
const publicApiInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add a request interceptor to include the authentication token
apiInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Export both instances
export { publicApiInstance };
export default apiInstance;

export async function sendPasswordResetEmail(email) {
  try {
    const response = await apiInstance.post(`/user/password-reset/email/`, {
      email: email,
    });
    Swal.fire("Success", response.data.message, "success");
  } catch (error) {
    if (error.response) {
      Swal.fire("Error", error.response.data.error, "error");
    } else {
      Swal.fire("Error", "An error occurred.", "error");
    }
  }
}
