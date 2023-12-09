// export default Home
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css"; // Assuming you have a CSS file for styling
import StudentIDForm from "./StudentIDForm";
import QRCodeScanner from "./QRCodeScanner";
import Swal from "sweetalert2";

function Home() {
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [location_id, setLocation_id] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const [scannedResult, setScannedResult] = useState("");
  const [isPaused, setIsPaused] = useState(false);

  const handleScan = (result) => {
    if (isPaused) return;
    if (result == undefined) return;
    setIsPaused(true);
    console.log(isPaused);
    setScannedResult(result);
    console.log(result);
  };

  const handleSubmit = () => {
    setScannedResult("");
  };

  useEffect(() => {
    if (isPaused) {
      // Reset isPaused after a delay (e.g., 3000 milliseconds)
      const timeoutId = setTimeout(() => {
        setIsPaused(false);
      }, 3000);

      // Cleanup the timeout to prevent memory leaks
      return () => clearTimeout(timeoutId);
    }
  }, [isPaused]);

  useEffect(() => {
    axios
      .get("http://localhost:3000")
      .then((res) => {
        if (res.data.Status === "Success") {
          setAuth(true);
          setLocation_id(res.data.location_id);
          setName(res.data.name);
        } else {
          setAuth(false);
          setMessage(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleLogout = () => {
    axios
      .get("http://localhost:3000/logout")
      .then(() => {
        if (res.data.Status === "Success") Swal.fire({titleText: 'Registered successfully!', icon: 'success', timer: 3000});
        else {
          Swal.fire({titleText: "Can't register location", icon: 'error', timer: 3000});
        }
      })
      .catch((err) => {
        Swal.fire({titleText: "There's a problem when registering location", icon: 'error', timer: 3000});
      });
  };

  return (
    <div className="home-container">
      {!auth ? (
        <div className="welcome-panel">
          <h3>Welcome to the Parking Management System</h3>
          <h3>Admin Site</h3>
          <p className="welcome-message">Manage your parking with ease.</p>
          <Link to="/login" className="btn btn-primary">
            Sign In
          </Link>
          <Link to="/register" className="btn btn-secondary">
            Sign Up
          </Link>
        </div>
      ) : (
        <div className="auth-container">
          <div className="user-info">
            <p>Location Name: {name}</p>
            <p>Location ID: {location_id}</p>
          </div>
          <div className="mb-1 p-0 d-flex justify-content-between logout-container">
          <Link to="/" className="btn btn-primary">
              Scan
            </Link>
            <Link to="/students" className="btn btn-secondary">
              View Students
            </Link>
            <Link to="/prices" className="btn btn-secondary">
              Edit Prices
            </Link>
            <a className="btn btn-danger" onClick={handleLogout}>
              Logout
            </a>
          </div>
          <div className="scanner" style={{ width: "100%" }}>
            <p style={{ margin: 0, marginTop: "1rem" }}>Scan QR Code here!</p>
            <div>
              <QRCodeScanner onScan={handleScan} />
            </div>
          </div>
          <StudentIDForm
            location_id={location_id}
            scannedResult={scannedResult}
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  );
}

export default Home;
