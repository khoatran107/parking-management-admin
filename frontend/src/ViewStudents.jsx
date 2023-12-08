import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./ViewStudents.css";

const ViewStudent = () => {
  const [auth, setAuth] = useState(false);
  const [location_id, setLocation_id] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);

  axios.defaults.withCredentials = true;

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
        navigate("/login");
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (!location_id) return;
    console.log(`http://localhost:3000/tickets/${location_id}`);
    axios
      .post(`http://localhost:3000/tickets/${location_id}`)
      .then((response) => {
        setTickets(response.data.sort((a, b) => (a.student_id - b.student_id)));
      })
      .catch((error) => {
        console.error("Error fetching tickets:", error);
      });
  }, [location_id]);

  return (
    <div className="home-container">
      {!auth ? (
        <div className="welcome-panel">
          <h3>Admin Site</h3>
          <p className="welcome-message">You are not logged in.</p>
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
            <Link to="/" className="btn btn-primary m-0">
              Back to scan
            </Link>
            <a className="btn btn-danger m-0" onClick={handleLogout}>
              Logout
            </a>
          </div>
          <div>
            <h4 className="my-4">Tickets for location id {location_id}</h4>
            <table className="table table-hover table-bordered">
              <thead>
                <tr className="table-primary">
                  <th scope="col">Student ID</th>
                  <th scope="col">Time In</th>
                  <th scope="col">Time Out</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket, i) => (
                  <tr key={ticket.student_id} className={ticket.paid? "table-success" : "table-danger"}>
                    <td>{ticket.student_id}</td>
                    <td>{ticket.time_in}</td>
                    <td>{ticket.time_out ? ticket.time_out: "Still Parking..."}</td>
                    <td>{ticket.paid ? "Paid": "Not Paid"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewStudent;
