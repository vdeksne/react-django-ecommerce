import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import apiInstance from "../../utils/axios";
import Swal from "sweetalert2";

function CreatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const axios = apiInstance;
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const otp = searchParams.get("otp");
  const uidb64 = searchParams.get("uidb64");
  const reset_token = searchParams.get("reset_token");

  const handleNewPasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleNewPasswordConfirmChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError(true);
      console.log("Password Does Not Match");
    } else {
      setError(false);

      console.log("otp ======", otp);
      console.log("uidb64 ======", uidb64);
      console.log("reset_token ======", reset_token);
      console.log("password ======", password);

      axios
        .post(`user/password-change/`, {
          otp,
          uidb64,
          reset_token,
          password,
        })
        .then((res) => {
          console.log(res.data.code);
          Swal.fire({
            icon: "success",
            title: "Password Changed Successfully",
          });
          navigate("/login");
        })
        .catch(() => {
          Swal.fire({
            icon: "error",
            title: "An Error Occurred Try Again",
          });
        });
    }
  };
  return (
    <section>
      <main className="" style={{ marginBottom: 100, marginTop: 50 }}>
        <div className="container">
          {/* Section: Login form */}
          <section className="">
            <div className="row d-flex justify-content-center">
              <div className="col-xl-5 col-md-8">
                <div className="card rounded-5">
                  <div className="card-body p-4">
                    <h3 className="text-center">Create New Password</h3>
                    <br />

                    <div className="tab-content">
                      <div
                        className="tab-pane fade show active"
                        id="pills-login"
                        role="tabpanel"
                        aria-labelledby="tab-login"
                      >
                        <form onSubmit={handlePasswordSubmit}>
                          {/* Email input */}
                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="Full Name">
                              Enter New Password
                            </label>
                            <input
                              type="password"
                              id="new-password"
                              required
                              name="password"
                              className="form-control"
                              onChange={handleNewPasswordChange}
                            />
                          </div>

                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="Full Name">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              id="confirm-password"
                              required
                              name="confirmPassword"
                              className="form-control"
                              onChange={handleNewPasswordConfirmChange}
                            />
                            {error !== null && (
                              <>
                                {error === true ? (
                                  <p className="text-danger fw-bold mt-2">
                                    Password Does Not Match
                                  </p>
                                ) : (
                                  <p className="text-success fw-bold mt-2">
                                    Password Matched
                                  </p>
                                )}
                              </>
                            )}
                          </div>

                          <div className="text-center">
                            <button
                              type="submit"
                              className="btn btn-primary w-100"
                            >
                              Reset Password
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </section>
  );
}

export default CreatePassword;
