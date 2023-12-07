// export default Home
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css'; // Assuming you have a CSS file for styling
import QRScanner from './QRScanner';

function Home() {
    const [auth, setAuth] = useState(false);
    const [message, setMessage] = useState('');
    const [location_id, setLocation_id] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get('http://localhost:3000')
            .then(res => {
                if (res.data.Status === 'Success') {
                    setAuth(true);
                    setLocation_id(res.data.location_id);
                    setName(res.data.name);
                } else {
                    setAuth(false);
                    setMessage(res.data.Error);
                }
            })
            .catch(err => console.log(err));
    }, []);

    const handleLogout = () => {
        axios.get('http://localhost:3000/logout')
            .then(() => {
                navigate('/login');
            })
            .catch(err => console.log(err));
    }

    return (
        <div className='home-container'>
          {!auth ? (
            <div className='welcome-panel'>
              <h3>Welcome to the Parking Management System</h3>
              <h3>Admin Site</h3>
              <p className='welcome-message'>Manage your parking with ease.</p>
              <Link to='/login' className='btn btn-primary'>Sign In</Link>
              <Link to='/register' className='btn btn-secondary'>Sign Up</Link>
            </div>
          ) :(
            <div className='auth-container'>
                <div className='user-info'>
                    <p>Location Name: {name}</p>
                    <p>Location ID: {location_id}</p>
                </div>
                <div className='scanner'>
                    <p>Scan QR Code here!</p>
                    <QRScanner />
                </div>
                <div className='logout-container'>
                    <button onClick={handleLogout}>Logout</button>
                </div>
          </div>
          )}
        </div>
      );
}

export default Home;
