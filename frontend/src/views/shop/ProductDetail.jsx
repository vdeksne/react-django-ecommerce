import { React, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaShoppingCart, FaSpinner } from "react-icons/fa";

import apiInstance, { publicApiInstance } from "../../utils/axios";
import Addon from "../plugin/Addon";
import GetCurrentAddress from "../plugin/UserCountry";
import UserData from "../plugin/UserData";
import CartID from "../plugin/cartID";
import { addToCart } from "../plugin/AddToCart";
import { addToWishlist } from "../plugin/addToWishlist";
import { CartContext } from "../plugin/Context";
import moment from "moment";
import Swal from "sweetalert2";

function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState({});
  const [selectedColor, setSelectedColor] = useState("No Color");
  const [selectedSize, setSelectedSize] = useState("No Size");
  const [quantity, setQuantity] = useState(1);

  const axios = apiInstance;
  const publicAxios = publicApiInstance;
  const { getCountry } = GetCurrentAddress();
  const userData = UserData();
  let cart_id = CartID();
  const cartContext = useContext(CartContext);
  const setCartCount = cartContext[1];

  const [productImage, setProductImage] = useState("");
  const [gallery, setgallery] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [color, setColor] = useState([]);
  const [size, setSize] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const [createReview, setCreateReview] = useState({
    user_id: 0,
    product_id: product?.id,
    review: "",
    rating: 0,
  });
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await publicAxios.get(`products/${slug}/`);
        setProduct(response.data);
        setProductImage(response.data.image);
        setgallery(response.data.gallery);
        setSpecifications(response.data.specification);
        setColor(response.data.color);
        setSize(response.data.size);
        setVendor(response.data.vendor);
        if (response.data) {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // ================== Adding Product to Cart ==================== //

  // Get color value after clicking on a button
  const handleColorButtonClick = (event) => {
    const colorNameInput = event.target
      .closest(".color_button")
      .parentNode.querySelector(".color_name");
    const colorImageInput = event.target
      .closest(".color_button")
      .parentNode.querySelector(".color_image");

    if (colorNameInput) {
      const colorName = colorNameInput.value;
      const colorImage = colorImageInput.value;
      setSelectedColor(colorName);
      setProductImage(colorImage);
    }
  };

  const handleSizeButtonClick = (event) => {
    const sizeNameInput = event.target
      .closest(".size_button")
      .parentNode.querySelector(".size_name");

    if (sizeNameInput) {
      const sizeName = sizeNameInput.value;
      setSelectedSize(sizeName);
    }
  };

  const handleQuantityChange = (event) => {
    setQuantity(Math.max(1, parseInt(event.target.value)));
  };

  const handleAddToCart = async () => {
    if (!product) return;

    setLoadingStates((prev) => ({ ...prev, [product.id]: "Adding..." }));

    try {
      await addToCart(
        product.id,
        userData?.user_id,
        quantity,
        product.price,
        product.shipping_amount,
        getCountry(),
        selectedSize,
        selectedColor,
        cart_id,
        () => {}
      );

      setLoadingStates((prev) => ({ ...prev, [product.id]: "Added to Cart" }));

      const url = userData?.user_id
        ? `cart-list/${cart_id}/${userData?.user_id}/`
        : `cart-list/${cart_id}/`;
      const response = await axios.get(url);
      setCartCount(response.data.length);
      Swal.fire({
        icon: "success",
        title: "Added To Cart",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      setLoadingStates((prev) => ({ ...prev, [product.id]: "Add to Cart" }));
    }
  };

  const handleAddToWishlist = async () => {
    if (!product) return;
    try {
      await addToWishlist(product.id, userData?.user_id);
      setWishlistLoading(true);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  const handleReviewChange = (event) => {
    setCreateReview({
      ...createReview,
      [event.target.name]: event.target.value,
    });
  };

  const fetchReviewData = async () => {
    axios.get(`reviews/${product?.id}/`).then((res) => {
      setReviews(res.data);
    });
  };
  useEffect(() => {
    fetchReviewData();
  }, [loading]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();

    const formdata = new FormData();

    formdata.append("user_id", userData?.user_id);
    formdata.append("product_id", product?.id);
    formdata.append("rating", createReview.rating);
    formdata.append("review", createReview.review);

    axios.post(`create-review/`, formdata).then(() => {
      fetchReviewData();
      Swal.fire({
        icon: "success",
        title: "Review created successfully",
      });
    });
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

  if (!product) {
    return (
      <div className="container text-center">
        <h2>Product not found</h2>
        <Link to="/products" className="btn btn-primary">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <main className="mb-4 mt-4">
        {/* Section: Product details */}
        <section className="mb-9">
          <div className="row gx-lg-5">
            <div className="col-md-6 mb-4 mb-md-0">
              {/* Gallery */}
              <div className="">
                <div className="row gx-2 gx-lg-3">
                  <div className="col-12 col-lg-12">
                    <div className="lightbox">
                      <img
                        src={productImage}
                        style={{
                          width: "100%",
                          height: 500,
                          objectFit: "cover",
                          borderRadius: 10,
                        }}
                        alt={productImage}
                        className="ecommerce-gallery-main-img active w-100 rounded-4 main-image-div"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-3 d-flex">
                  {gallery?.map((g, index) => (
                    <div className="p-3" key={index}>
                      <img
                        src={g.image}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                        alt="Gallery image 1"
                        className="ecommerce-gallery-main-img active rounded-4"
                      />
                    </div>
                  ))}
                </div>
              </div>
              {/* Gallery */}
            </div>
            <div className="col-md-6 mb-4 mb-md-0">
              {/* Details */}
              <div>
                <h1 className="fw-bold mb-3">{product.title}</h1>
                <div className="d-flex text-primary just align-items-center">
                  <ul className="mb-3 d-flex p-0" style={{ listStyle: "none" }}>
                    {product.product_rating === null && (
                      <li>
                        <i className="fas fa-star fa-sm text-warning ps-0" />
                      </li>
                    )}
                    {product.product_rating > 1 &&
                      product.product_rating < 2 && (
                        <li>
                          <i className="fas fa-star fa-sm text-warning ps-0" />
                        </li>
                      )}
                    {product.product_rating > 2 &&
                      product.product_rating < 3 && (
                        <>
                          <li>
                            <i className="fas fa-star fa-sm text-warning ps-0" />
                          </li>
                          <li>
                            <i className="fas fa-star fa-sm text-warning ps-0" />
                          </li>
                        </>
                      )}

                    {product.product_rating > 3 &&
                      product.product_rating < 4 && (
                        <>
                          <li>
                            <i className="fas fa-star fa-sm text-warning ps-0" />
                          </li>
                          <li>
                            <i className="fas fa-star fa-sm text-warning ps-0" />
                          </li>
                          <li>
                            <i className="fas fa-star fa-sm text-warning ps-0" />
                          </li>
                        </>
                      )}

                    {product.product_rating > 4 &&
                      product.product_rating < 5 && (
                        <>
                          <li>
                            <i className="fas fa-star fa-sm text-warning ps-0" />
                          </li>
                          <li>
                            <i className="fas fa-star fa-sm text-warning ps-0" />
                          </li>
                          <li>
                            <i className="fas fa-star fa-sm text-warning ps-0" />
                          </li>
                          <li>
                            <i className="fas fa-star fa-sm text-warning ps-0" />
                          </li>
                        </>
                      )}

                    {product.product_rating > 5 &&
                      product.product_rating < 6 && (
                        <>
                          <li>
                            <i className="fas fa-star fa-sm text-warning ps-0" />
                          </li>
                          <li>
                            <i className="fas fa-star fa-sm text-warning ps-0" />
                          </li>
                          <li>
                            <i className="fas fa-star fa-sm text-warning ps-0" />
                          </li>
                          <li>
                            <i className="fas fa-star fa-sm text-warning ps-0" />
                          </li>
                          <li>
                            <i className="fas fa-star fa-sm text-warning ps-0" />
                          </li>
                        </>
                      )}

                    <li style={{ marginLeft: 10, fontSize: 13 }}>
                      <a href="" className="text-decoration-none align-middle">
                        {product.product_rating !== null && (
                          <>
                            <strong className="me-2 text-dark">
                              {product?.product_rating.toFixed(1)}/5.0
                            </strong>
                            ({product?.rating_count} reviews)
                          </>
                        )}

                        {product.product_rating === null && (
                          <>
                            <strong className="me-2 text-dark">
                              Not Rated Yet
                            </strong>
                            (0 reviews)
                          </>
                        )}
                      </a>
                    </li>
                  </ul>
                </div>
                <h5 className="mb-3">
                  <s className="text-muted me-2 small align-middle">
                    ${product.old_price}
                  </s>
                  <span className="align-middle">${product?.price}</span>{" "}
                  <span
                    className="align-middle text-muted"
                    style={{ fontSize: "13px", fontStyle: "italic" }}
                  >
                    ({product.get_precentage}% OFF)
                  </span>
                </h5>
                <p className="text-muted">
                  {product.description?.slice(0, 300)}...
                </p>
                <div className="table-responsive">
                  <table className="table table-sm table-borderless mb-0">
                    <tbody>
                      {specifications?.map((s, index) => (
                        <tr key={index}>
                          <th className="ps-0 w-25" scope="row">
                            <strong>{s.title}</strong>
                          </th>
                          <td>{s.content}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <hr className="" />
                <div>
                  <div className="row flex-column">
                    {/* Quantity */}
                    <div className="col-md-6 mb-4">
                      <div className="form-outline">
                        <label className="form-label" htmlFor="typeNumber">
                          <b>Quantity</b>
                        </label>
                        <input
                          type="number"
                          id="typeNumber"
                          className="form-control quantity"
                          min={1}
                          value={quantity}
                          onChange={handleQuantityChange}
                        />
                      </div>
                    </div>

                    {/* Size */}
                    {size?.length > 0 ? (
                      // Render something when the 'size' array has items
                      <div className="col-md-6 mb-4">
                        <div className="form-outline">
                          <label className="form-label" htmlFor="typeNumber">
                            <b>Size:</b> {selectedSize}
                          </label>
                        </div>
                        <div className="d-flex">
                          {size?.map((s, index) => (
                            <div key={index} className="me-2">
                              <input
                                type="hidden"
                                className="size_name"
                                value={s.name}
                              />
                              <button
                                onClick={handleSizeButtonClick}
                                className={`btn btn-secondary size_button ${
                                  selectedSize === s.name ? "active" : ""
                                }`}
                              >
                                {s.name}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      // Render empty div
                      <div></div>
                    )}

                    {/* Colors */}
                    {color?.length > 0 ? (
                      <div className="col-md-6 mb-4">
                        <div className="form-outline">
                          <label className="form-label" htmlFor="typeNumber">
                            <b>Color:</b> <span>{selectedColor}</span>
                          </label>
                        </div>
                        <div className="d-flex">
                          {color?.map((c, index) => (
                            <div key={index}>
                              <input
                                type="hidden"
                                className="color_name"
                                value={c.name}
                              />
                              <input
                                type="hidden"
                                className="color_image"
                                value={c.image}
                              />
                              <button
                                className={`btn p-3 me-2 color_button ${
                                  selectedColor === c.name ? "active" : ""
                                }`}
                                onClick={handleColorButtonClick}
                                style={{
                                  backgroundColor: `${c.color_code}`,
                                }}
                              ></button>
                            </div>
                          ))}
                        </div>
                        <hr />
                      </div>
                    ) : (
                      // Render empty div
                      <div></div>
                    )}
                  </div>
                  <button
                    onClick={handleAddToCart}
                    type="button"
                    className="btn btn-primary btn-rounded me-2 add-to-cart"
                    disabled={loadingStates[product.id] === "Adding..."}
                  >
                    {loadingStates[product.id] === "Added to Cart" ? (
                      <>
                        Added to Cart <FaCheckCircle />
                      </>
                    ) : loadingStates[product.id] === "Adding..." ? (
                      <>
                        Adding to Cart <FaSpinner className="fas fa-spin" />
                      </>
                    ) : (
                      <>
                        Add to Cart <FaShoppingCart />
                      </>
                    )}
                  </button>
                  {wishlistLoading === true && (
                    <button
                      onClick={handleAddToWishlist}
                      className="btn btn-danger btn-floating"
                      data-mdb-toggle="tooltip"
                      title="Add to wishlist"
                    >
                      <i className="fas fa-heart" />
                    </button>
                  )}
                  {wishlistLoading === false && (
                    <button
                      onClick={handleAddToWishlist}
                      className="btn btn-secondary btn-floating"
                      data-mdb-toggle="tooltip"
                      title="Add to wishlist"
                    >
                      <i className="fas fa-heart" />
                    </button>
                  )}
                </div>
              </div>
              {/* Details */}
            </div>
          </div>
        </section>
        {/* Section: Product details */}
        <hr />
        <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className="nav-link active"
              id="pills-home-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-home"
              type="button"
              role="tab"
              aria-controls="pills-home"
              aria-selected="true"
            >
              Specifications
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="pills-profile-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-profile"
              type="button"
              role="tab"
              aria-controls="pills-profile"
              aria-selected="false"
            >
              Vendor
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="pills-contact-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-contact"
              type="button"
              role="tab"
              aria-controls="pills-contact"
              aria-selected="false"
            >
              Review
            </button>
          </li>
          {/* <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link"
                                    id="pills-disabled-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-disabled"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-disabled"
                                    aria-selected="false"
                                >
                                    Question &amp; Answer
                                </button>
                            </li> */}
        </ul>
        <div className="tab-content" id="pills-tabContent">
          <div
            className="tab-pane fade show active"
            id="pills-home"
            role="tabpanel"
            aria-labelledby="pills-home-tab"
            tabIndex={0}
          >
            <div className="table-responsive">
              <table className="table table-sm table-borderless mb-0">
                <tbody>
                  {specifications?.map((s, index) => (
                    <tr key={index}>
                      <th className="ps-0 w-25" scope="row">
                        <strong>{s.title}</strong>
                      </th>
                      <td>{s.content}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="pills-profile"
            role="tabpanel"
            aria-labelledby="pills-profile-tab"
            tabIndex={0}
          >
            <div className="card mb-3" style={{ maxWidth: 400 }}>
              <div className="row g-0">
                <div className="col-md-4">
                  <img
                    src={vendor?.image}
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                    }}
                    alt="User Image"
                    className="img-fluid"
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">{vendor?.name}</h5>
                    <p className="card-text">{vendor?.description}</p>
                    {/* <div className="d-flex mb-2">
                                                    <ul className="list-inline m-0">
                                                        <li className="list-inline-item">
                                                            <i className="fas fa-star text-primary" />
                                                        </li>
                                                        <li className="list-inline-item">
                                                            <i className="fas fa-star text-primary" />
                                                        </li>
                                                        <li className="list-inline-item">
                                                            <i className="fas fa-star text-primary" />
                                                        </li>
                                                        <li className="list-inline-item">
                                                            <i className="fas fa-star text-primary" />
                                                        </li>
                                                        <li className="list-inline-item">
                                                            <i className="fas fa-star-half-alt text-primary" />
                                                        </li>
                                                    </ul>
                                                    <span className="ms-2">4.5</span>
                                                </div> */}
                    {/* <button className="btn btn-primary me-2">Follow</button>
                                                <button className="btn btn-secondary">Send Message</button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="pills-contact"
            role="tabpanel"
            aria-labelledby="pills-contact-tab"
            tabIndex={0}
          >
            <div className="container mt-5">
              <div className="row">
                {/* Column 1: Form to create a new review */}
                <div className="col-md-6">
                  <h2>Create a New Review</h2>
                  <form method="POST" onSubmit={handleReviewSubmit}>
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">
                        Rating
                      </label>
                      <select
                        onChange={handleReviewChange}
                        name="rating"
                        className="form-select"
                        id=""
                      >
                        <option value="1">★</option>
                        <option value="2">★★</option>
                        <option value="3">★★★</option>
                        <option value="4">★★★★</option>
                        <option value="5">★★★★★</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="reviewText" className="form-label">
                        Review
                      </label>
                      <textarea
                        className="form-control"
                        rows={4}
                        placeholder="Write your review"
                        onChange={handleReviewChange}
                        name="review"
                        value={createReview.review}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Submit Review
                    </button>
                  </form>
                </div>
                {/* Column 2: Display existing reviews */}
                <div className="col-md-6">
                  {reviews.length > 0 ? (
                    <>
                      <h2>All Reviews</h2>
                      {reviews.map((review) => (
                        <div className="card mb-3 rounded-3">
                          <div className="row g-0">
                            <div className="col-md-3">
                              <img
                                src={review.profile.image}
                                alt="User Image"
                                className="img-fluid"
                              />
                            </div>
                            <div className="col-md-9">
                              <div className="card-body">
                                <h5 className="card-title">
                                  {review.profile.full_name} {}
                                </h5>
                                <p className="card-text">
                                  {moment(review.date).format("MM/DD/YYYY")}
                                </p>
                                <p className="card-text">{review.review}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <h2>No Reviews Yet</h2>
                  )}

                  {/* More reviews can be added here */}
                </div>
              </div>
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="pills-disabled"
            role="tabpanel"
            aria-labelledby="pills-disabled-tab"
            tabIndex={0}
          >
            <div className="container mt-5">
              <div className="row">
                {/* Column 1: Form to submit new questions */}
                <div className="col-md-6">
                  <h2>Ask a Question</h2>
                  <form>
                    <div className="mb-3">
                      <label htmlFor="askerName" className="form-label">
                        Your Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="askerName"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="questionText" className="form-label">
                        Question
                      </label>
                      <textarea
                        className="form-control"
                        id="questionText"
                        rows={4}
                        placeholder="Ask your question"
                        defaultValue={""}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Submit Question
                    </button>
                  </form>
                </div>
                {/* Column 2: Display existing questions and answers */}
                <div className="col-md-6">
                  <h2>Questions and Answers</h2>
                  <div className="card mb-3">
                    <div className="card-body">
                      <h5 className="card-title">User 1</h5>
                      <p className="card-text">August 10, 2023</p>
                      <p className="card-text">
                        What are the available payment methods?
                      </p>
                      <h6 className="card-subtitle mb-2 text-muted">Answer:</h6>
                      <p className="card-text">
                        We accept credit/debit cards and PayPal as payment
                        methods.
                      </p>
                    </div>
                  </div>
                  <div className="card mb-3">
                    <div className="card-body">
                      <h5 className="card-title">User 2</h5>
                      <p className="card-text">August 15, 2023</p>
                      <p className="card-text">How long does shipping take?</p>
                      <h6 className="card-subtitle mb-2 text-muted">Answer:</h6>
                      <p className="card-text">
                        Shipping usually takes 3-5 business days within the US.
                      </p>
                    </div>
                  </div>
                  {/* More questions and answers can be added here */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductDetail;
