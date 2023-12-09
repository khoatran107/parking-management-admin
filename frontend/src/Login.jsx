import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function Login() {
  const [values, setValues] = useState({
    location_id: "",
    password: "",
  });

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/login", values)
      .then((res) => {
        if (res.data.Status === "Success") navigate("/");
        else {
          Swal.fire({titleText: "Wrong location id or password", icon: 'error', timer: 3000});
        }
      })
      .catch((err) => {
        Swal.fire({titleText: "System fault, can't login", icon: 'error', timer: 3000});
      });
  };
  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div
        style={{ maxWidth: "90%", width: "400px" }}
        className="bg-white p-3 rounded "
      >
        <h2>Sign-In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label htmlFor="location_id">
              <strong>Location ID</strong> (11 digits)
            </label>
            <input
              type="text"
              placeholder="Enter Location ID"
              name="location_id"
              className="form-control rounded-0"
              pattern="\d{11}"
              required // This makes sure the field is filled out
              onChange={(e) =>
                setValues({ ...values, location_id: e.target.value })
              }
            />
          </div>
          <div className="mb-2">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              className="form-control rounded-0"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            className="btn btn-success w-100 rounded-0 mx-0"
          >
            Log in
          </button>
          <p className="m-0">Don't have an accout? Create one!</p>
          <Link
            to="/register"
            className="btn btn-secondary border w-100 rounded-0 text-decoration-none mx-0"
          >
            Create Account
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
