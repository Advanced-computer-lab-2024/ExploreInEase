import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NetworkService from '../NetworkService';

const TouristSignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    mobileNumber: '',
    nationality: '',
    dob: '',
    jobOrStudent: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission
    const age = calculateAge(formData.dob);
    
    if (age < 18) {
      setError('You must be at least 18 years old to register as a tourist.');
      return; // Stop execution if age is less than 18
    }

    try {
      const options = {
        apiPath: '/register/tourist',
        body: {
          email: formData.email,
          username: formData.username,
          password: formData.password,
          mobileNum: formData.mobileNumber, // API field mapping
          nation: formData.nationality, // API field mapping
          dob: formData.dob,
          profession: formData.jobOrStudent // API field mapping
        }
      };
      
      const response = await NetworkService.post(options);
      const tourist=response.tourist;
      setSuccess(response.message); // Set success message
      // console.log(response);
      navigate(`/TouristHomePage`,{state:{User:tourist}});

    } catch (err) {
      if (err.response) {
          console.log(err.message);
        setError(err.response.data.message); // Set error message from server response if exists
      } else {
        setError('An unexpected error occurred.'); // Generic error message
      }
    }
  };

  return (
    <div className="signup-form">
      <h2>Tourist Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />

        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />

        <label>Mobile Number:</label>
        <input
          type="tel"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleInputChange}
          required
        />

        <label>Nationality:</label>
        <input
          type="text"
          name="nationality"
          value={formData.nationality}
          onChange={handleInputChange}
          required
        />

        <label>Date of Birth:</label>
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleInputChange}
          required
        />

        <label>Job/Student:</label>
        <input
          type="text"
          name="jobOrStudent"
          value={formData.jobOrStudent}
          onChange={handleInputChange}
          required
        />

        <button type="submit">Register as Tourist</button>
      </form>
    </div>
  );
};

export default TouristSignUp;
