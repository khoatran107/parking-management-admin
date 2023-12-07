import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function Register() {
    const [values, setValues] = useState({
        location_id: '',
        password: ''
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3000/register', values)
        .then(res => {console.log(res)})
        .catch(err => {console.log(err)})
    }

  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
          <div className='bg-white p-3 rounded'>
            <h2>Sign-Up</h2>
            <form onSubmit = {handleSubmit}>
                <div className='mb-2'>
                    <label htmlFor='name'><strong>Location Name</strong></label>
                    <input type='text' placeholder='Enter Name' name ='name' className='form-control rounded-0'
                    onChange={e => setValues({...values,name:e.target.value})}/>
                    
                </div>
                <div className='mb-2'>
                    <label htmlFor='location_id'><strong>Location ID</strong> (11 digits)</label>
                    <input type='text' placeholder='Enter Location ID' name='location_id' className='form-control rounded-0' pattern="\d{11}" required // This makes sure the field is filled out
                        onChange={e => setValues({...values, location_id: e.target.value})}/>
                </div>
                <div className='mb-2'>
                    <label htmlFor='password'><strong>Password</strong></label>
                    <input type='password' placeholder='Enter Password' name = 'password' className='form-control rounded-0'
                    onChange={e => setValues({...values, password :e.target.value})}/>
                </div>
                <button type='submit' className='btn btn-success w-100 rounded-0 mx-0'>Sign up</button>
                <p className='m-0'>Already have an account?</p>
                <Link to="/login" className='btn btn-secondary border w-100 bg-grey rounded-0 text-decoration-none mx-0'>Login</Link>
                
            </form>
        </div>
    </div>
  )
}

export default Register