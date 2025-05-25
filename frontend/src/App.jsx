// import "./App.css"; // Importing the CSS file for styling.

import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom"; // Importing necessary components from 'react-router-dom' for routing.
// import { useState } from "react"; // useEffect
import Home from "./views/shop/home"; // Importing the 'Home' component.
// import MainWrapper from "./layouts/MainWrapper"; // Importing the 'MainWrapper' component.
import Login from "./views/auth/Login"; // Importing the 'Login' component.
import PrivateRoute from "./components/PrivateRoute";
import Logout from "./views/auth/Logout"; // Importing the 'Logout' component.
// import Private from "./views/auth/private"; // Importing the 'Private' component.
import Register from "./views/auth/Register"; // Importing the 'Register' component.
import Dashboard from "./views/auth/Dashboard";
import StoreHeader from "./views/base/StoreHeader";
import StoreFooter from "./views/base/StoreFooter";
import Products from "./views/shop/Products"; // Add Products import
import ProductDetail from "./views/shop/ProductDetail";
import Cart from "./views/shop/Cart";
import Checkout from "./views/shop/Checkout";
import PaymentSuccess from "./views/shop/PaymentSuccess";
import Invoice from "./views/shop/Invoice";
import Account from "./views/customer/Account";
import Orders from "./views/customer/Orders";
import OrderDetail from "./views/customer/OrderDetail";
import Wishlist from "./views/customer/Wishlist.jsx";
import Notifications from "./views/customer/Notifications";
import Settings from "./views/customer/Settings";
import UserData from "./views/plugin/UserData";
import ForgotPassword from "./views/auth/ForgotPassword";
import CreatePassword from "./views/auth/CreatePassword";
import { useState } from "react";
import { CartContext } from "./views/plugin/Context";

function App() {
  // Define the main 'App' component.
  const [cartCount, setCartCount] = useState(0);
  // const userData = UserData();
  // let cart_id = CartID();
  // const axios = apiInstance;

  // useEffect(() => {
  //   const url = userData?.user_id
  //     ? `cart-list/${cart_id}/${userData?.user_id}/`
  //     : `cart-list/${cart_id}/`;
  //   axios.get(url).then((res) => {
  //     setCartCount(res.data.length);
  //   });
  // }, []);

  return (
    <CartContext.Provider value={[cartCount, setCartCount]}>
      <BrowserRouter>
        <StoreHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/products" element={<Products />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/create-new-password" element={<CreatePassword />} />
          <Route path="/detail/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout/:cart_id" element={<Checkout />} />
          <Route
            path="/payment-success/:order_oid"
            element={<PaymentSuccess />}
          />
          <Route path="/invoice/:order_oid" element={<Invoice />} />
          <Route
            path="/customer/account"
            element={
              <PrivateRoute>
                <Navigate
                  to={`/customer/account/${localStorage.getItem("user_id")}`}
                  replace
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/customer/orders"
            element={
              <PrivateRoute>
                <Navigate
                  to={`/customer/account/${localStorage.getItem(
                    "user_id"
                  )}/orders`}
                  replace
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/customer/account/:user_id"
            element={
              <PrivateRoute>
                <Account />
              </PrivateRoute>
            }
          />
          <Route
            path="/customer/account/:user_id/orders"
            element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            }
          />
          <Route
            path="/customer/account/:user_id/orders/:order_oid"
            element={
              <PrivateRoute>
                <OrderDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/customer/account/:user_id/wishlist"
            element={
              <PrivateRoute>
                <Wishlist />
              </PrivateRoute>
            }
          />
          <Route
            path="/customer/account/:user_id/notifications"
            element={
              <PrivateRoute>
                <Notifications />
              </PrivateRoute>
            }
          />
          <Route
            path="/customer/account/:user_id/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
        </Routes>
        <StoreFooter />
      </BrowserRouter>
    </CartContext.Provider>
  );
}

export default App; // Export the 'App' component as the default export.
