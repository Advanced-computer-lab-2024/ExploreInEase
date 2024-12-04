// src/components/GuideAdvertiserSignUp.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NetworkService from '../NetworkService';
import './Signup.css';

const GuideAdvertiserSignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    type: 'tourGuide',
    id: null,
    taxRegistry: null,
    certificates: null,
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for feedback

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value, // Store the file or the input value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state
    console.log(formData);

    try {
        // Step 1: Prepare registration data as an object
        const registrationData = {
            email: formData.email,
            username: formData.username,
            password: formData.password,
            type: formData.type,
        };

        // Step 2: Register user
        const options = {
            apiPath: `/register/${formData.type}`,
            body: registrationData, // Pass the object directly
        };

        const registerResponse = await NetworkService.post(options);
        console.log(registerResponse);
        const userId = registerResponse.User._id;
        console.log("User ID:", userId);

        // Step 3: Prepare document upload data as objects for each file
        const uploadFiles = [
            { file: formData.id, docType: 'nationalId' },
            formData.type === 'tourGuide' && { file: formData.certificates, docType: 'certificate' },
            (formData.type === 'advertiser' || formData.type === 'seller') && { file: formData.taxRegistry, docType: 'taxRegistry' }
        ].filter(Boolean); // Remove any false entries

        // Step 4: Upload each document separately
        for (const uploadFile of uploadFiles) {
          // Create FormData instance and append file and docType
          const uploadData = new FormData();
          uploadData.append('file', uploadFile.file);
          uploadData.append('docType', uploadFile.docType);

          const optionsForUpload = {
              apiPath: `/uploadDocument/${userId}`,
              body: uploadData,
              headers: { 'Content-Type': 'multipart/form-data' }
          };

          const uploadResponse = await NetworkService.post(optionsForUpload);
          console.log(`${uploadFile.docType} uploaded:`, uploadResponse.message);
      }
      
      

        // Step 5: Success handling
        setSuccess('Files uploaded successfully');
        navigate(`/Login`);
    } catch (err) {
        if (err.response) {
            setError(err.response.data.message);
        } else {
            setError('An unexpected error occurred.');
        }
    } finally {
        setLoading(false); // Reset loading state
    }
};

  

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <label>Email:</label>
      <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
      <label>Username:</label>
      <input type="text" name="username" value={formData.username} onChange={handleInputChange} required />
      <label>Password:</label>
      <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
      <label>Select Role:</label>
      <select name="type" value={formData.type} onChange={handleInputChange} required>
        <option value="tourGuide">Tour Guide</option>
        <option value="advertiser">Advertiser</option>
        <option value="seller">Seller</option>
      </select>

      {/* Conditional rendering of file inputs based on selected role */}
      {formData.type === 'tourGuide' && (
        <>
          <label>Upload ID:</label>
          <input type="file" name="id" onChange={handleInputChange} accept=".jpg,.jpeg,.png,.pdf" required />
          <label>Upload Certificates:</label>
          <input type="file" name="certificates" onChange={handleInputChange} accept=".jpg,.jpeg,.png,.pdf" required />
        </>
      )}
      {(formData.type === 'advertiser' || formData.type === 'seller') && (
        <>
          <label>Upload ID:</label>
          <input type="file" name="id" onChange={handleInputChange} accept=".jpg,.jpeg,.png,.pdf" required />
          <label>Upload Taxation Registry Card:</label>
          <input type="file" name="taxRegistry" onChange={handleInputChange} accept=".jpg,.jpeg,.png,.pdf" required />
        </>
      )}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Registering...' : `Register as ${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}`}
      </button>
    </form>
  );
};

export default GuideAdvertiserSignUp;
