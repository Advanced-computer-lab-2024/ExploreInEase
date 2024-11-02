// src/components/GuideAdvertiserSignUp.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Make sure to import axios
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
    const registrationData = new FormData();
    registrationData.append('email', formData.email);
    registrationData.append('username', formData.username);
    registrationData.append('password', formData.password);
    registrationData.append('type', formData.type);

    // Append files only if they exist
    if (formData.type === 'tourGuide') {
      registrationData.append('id', formData.id);
      registrationData.append('certificates', formData.certificates);
    } else {
      registrationData.append('id', formData.id);
      registrationData.append('taxRegistry', formData.taxRegistry);
    }

    try {
      // Step 1: Register user
      const options = {
        apiPath: '/register/{type}',
        body: registrationData,
        urlParam: { type: formData.type },
      };
      const registerResponse = await NetworkService.post(options);
      const userId = registerResponse.data.User._id; // Assuming your API returns the user ID after registration

      // Step 2: Prepare the document upload
      const formDataForUpload = new FormData();
      formDataForUpload.append('file', formData.type === 'tourGuide' ? formData.certificates : formData.taxRegistry); // Upload the relevant document
      formDataForUpload.append('docType', formData.type === 'tourGuide' ? 'certificate' : 'taxRegistry'); // Append docType to formData

      const optionsForUpload = {
        apiPath: `/uploadDocument/${userId}`,
        body: formDataForUpload,
      };
      // Step 3: Upload the document
      const uploadResponse = await axios.post(optionsForUpload);
      setSuccess(uploadResponse.data.message);

      // Check if the upload was successful
      if (uploadResponse.data.message === 'File uploaded successfully') {
        console.log('File ID:', uploadResponse.data.fileId); // Log the file ID
        const user = registerResponse.data.User;
        navigate(`/${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}HomePage`, { state: { user } });
      }
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
