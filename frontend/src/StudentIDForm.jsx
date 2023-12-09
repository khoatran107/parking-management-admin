import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';

const StudentIDForm = ({location_id, scannedResult, onSubmit}) => {
  const [student_id, setStudentID] = useState('');
  useEffect(() => {
    setStudentID(scannedResult);
  }, [scannedResult]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send a POST request using Axios to localhost:3000/add_time
    const currentDateTime = new Date(Date.now() + 7 * (60 * 60 * 1000)).toISOString().slice(0, 19).replace("T", " ");
    try {
      const response = await axios.post('http://localhost:3000/add_time', {
        student_id: parseInt(student_id),
        location_id,
        time: currentDateTime
      });
      console.log(response);

      if (response.status === 200 && !response.data.error) {
        Swal.fire({titleText: 'Student ID added successfully!', icon: 'success', timer: 1200});
      } else {
        Swal.fire({titleText:'Error adding Student ID. Please try again!', icon: 'error', timer:5000});
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({titleText:'An unknown error occurs. Please try again!', icon: 'error', timer:5000});
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