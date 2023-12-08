import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';

const StudentIDForm = ({location_id, scannedResult, onSubmit}) => {
  const [student_id, setStudentID] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send a POST request using Axios to localhost:3000/add_time
    const currentDateTime = new Date().toISOString().slice(0, 19).replace("T", " ");
    try {
      const response = await axios.post('http://localhost:3000/add_time', {
        student_id,
        location_id,
        time: currentDateTime
      });

      if (response.status === 200) {
        Swal.fire('Student ID added successfully!');
      } else {
        Swal.fire('Error adding Student ID. Please try again!');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire('An error occurred. Please try again.');
    }
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="student_id" className="form-label">
            Student ID:
          </label>
          <input
            type="text"
            className="form-control"
            id="student_id"
            pattern="\d{11}"
            title="Please enter a valid 11-digit student ID."
            value={scannedResult}
            onChange={(e) => setStudentID(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default StudentIDForm;