import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function Register() {
  const [values, setValues] = useState({
    location_id: "",
    password: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/register", values)
      .then((res) => {
        if (res.status === 200 && !res.data.error) {
          Swal.fire({
            titleText: "Registered successfully!",
            icon: "success",
            timer: 1200,
          });
        } else {
          Swal.fire({
            titleText: "Location ID has been used. Please try again!",
            icon: "error",
            timer: 5000,
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          titleText: "An unknown error occurs. Please try again!",
          icon: "error",
          timer: 5000,
        });
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
      <div
        style={{ maxWidth: "90%", width: "400px" }}
        className="bg-white p-3 rounded"
      >
        <h2>Sign-Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label htmlFor="name">
              <strong>Location Name</strong>
            </label>
            <input
              type="text"
              placeholder="Enter Name"
              name="name"
              className="form-control rounded-0"
              onChange={(e) => setValues({ ...values, name: e.target.value })}
            />
          </div>
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
            Sign up
          </button>
          <p className="m-0">Already have an account?</p>
          <Link
            to="/login"
            className="btn btn-secondary border w-100 bg-grey rounded-0 text-decoration-none mx-0"
          >
            Login
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Register;
