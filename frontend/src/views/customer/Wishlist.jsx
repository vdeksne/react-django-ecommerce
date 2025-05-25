import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { publicApiInstance } from "../../utils/axios";
import Swal from "sweetalert2";
import Sidebar from "./Sidebar";

function Wishlist() {
  const { user_id } = useParams();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const publicAxios = publicApiInstance;

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await publicAxios.get(`customer/wishlist/${user_id}/`);
        setWishlist(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load wishlist. Please try again.",
        });
      }
    };

    fetchWishlist();
  }, [user_id]);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await publicAxios.delete(`customer/wishlist/${user_id}/${productId}/`);
      setWishlist(wishlist.filter((item) => item.product.id !== productId));
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Product removed from wishlist",
      });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to remove product from wishlist",
      });
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await publicAxios.post(`customer/cart/${user_id}/`, {
        product_id: productId,
        quantity: 1,
      });
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Product added to cart",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add product to cart",
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
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-3">
          <Sidebar />
        </div>
        <div className="col-md-9">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">My Wishlist</h2>
              {wishlist.length === 0 ? (
                <div className="text-center py-5">
                  <h4>Your wishlist is empty</h4>
                  <p>Add items to your wishlist to save them for later.</p>
                  <Link to="/shop" className="btn btn-primary">
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="row">
                  {wishlist.map((item) => (
                    <div key={item.id} className="col-md-6 mb-4">
                      <div className="card h-100">
                        <div className="position-relative">
                          <img
                            src={item.product.image}
                            className="card-img-top"
                            alt={item.product.title}
                            style={{
                              height: "200px",
                              objectFit: "cover",
                            }}
                          />
                          <button
                            className="btn btn-danger position-absolute top-0 end-0 m-2"
                            onClick={() =>
                              handleRemoveFromWishlist(item.product.id)
                            }
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                        <div className="card-body">
                          <h5 className="card-title">{item.product.title}</h5>
                          <p className="card-text text-muted">
                            {item.product.vendor.title}
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="mb-0">
                              ${Number(item.product.price).toFixed(2)}
                            </h6>
                            <button
                              className="btn btn-primary"
                              onClick={() => handleAddToCart(item.product.id)}
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wishlist;
