import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./ViewStudents.css";
import ReactTable from "react-table";
import { Table, Container, Button } from "react-bootstrap";

const ViewTimePrice = () => {
  const [auth, setAuth] = useState(false);
  const [location_id, setLocation_id] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [submitted, setSubmitted] = useState(false);

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
    console.log(`http://localhost:3000/time_price/${location_id}`);
    axios
      .get(`http://localhost:3000/time_price/${location_id}`)
      .then((response) => {
        setTableData(response.data.sort((a, b) => a.start_time - b.start_time));
      })
      .catch((error) => {
        console.error("Error fetching time price:", error);
      });
  }, [location_id]);

  const [columns, setColumns] = useState([
    { Header: "No.", accessor: "id" },
    { Header: "Time Start", accessor: "time_start", editable: true },
    { Header: "Time End", accessor: "time_end", editable: true },
    { Header: "Price", accessor: "price", editable: true },
  ]);

  const [showMessage, setShowMessage] = useState(false);
  const handleAddRow = () => {
    const newData = [...tableData];
    newData.push({});
    setTableData(newData);
  };

  const handleRemoveRow = (index) => {
    if (tableData.length === 1) {
      setShowMessage(true);
      return;
    }
    const newData = [...tableData];
    newData.splice(index, 1);
    setTableData(newData);
  };

  const handleChange = (e, index, key) => {
    const newData = [...tableData];
    newData[index][key] = e.target.value;
    setTableData(newData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/update_time_price', {location_id: location_id, data: tableData});
      if (response.status === 200) {
        console.log('Data updated successfully!', response.data);
      } else {
        console.error('Error updating data:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

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
          </div>{" "}
          <Container className="mt-4">
            <h2>Editable Price Table</h2>
            {showMessage && (
              <Alert variant="warning" onClose={() => setShowMessage(false)}>
                Cannot remove the last row!
              </Alert>
            )}
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Time Start</th>
                  <th>Time End</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <input
                        pattern="^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$"
                        type="text"
                        className="form-control"
                        value={item.time_start}
                        onChange={(e) => handleChange(e, index, "time_start")}
                      />
                    </td>
                    <td>
                      <input
                        pattern="^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$"
                        type="text"
                        className="form-control"
                        value={item.time_end}
                        onChange={(e) => handleChange(e, index, "time_end")}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={item.price}
                        onChange={(e) => handleChange(e, index, "price")}
                      />
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemoveRow(index)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button
              type="button"
              className="btn btn-primary btn-sm mb-3 me-2"
              onClick={handleAddRow}
            >
              Add Row
            </Button>
            </Container>
            <Button
              type="button"
              className="btn btn-primary btn-lg mt-3"
              onClick={handleSubmit}
            >
              Submit Data
            </Button>
        </div>
      )}
    </div>
  );
};

export default ViewTimePrice;
