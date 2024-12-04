import React, { useState } from "react";
import './AddUser.css'; // Import the CSS file for styling
import NetworkService from "../NetworkService";
const AddUser = () => {
  const [user, setUser] = useState({
    type: "admin", // Default role as admin (lowercase to match API enum)
    username: "",
    password: "",
  });

  const [showSuccess, setShowSuccess] = useState(false); // To handle success popup
  const [showError, setShowError] = useState(null); // To handle error messages

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,  // Update user state for each field
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const options = {
      apiPath: '/addGovernorOrAdmin', 
      body: { username: user.username, password: user.password, type: user.type }, // Request body

    };

    try {
      const data = await NetworkService.post(options); // Call the POST method
      console.log("User added:", data);
      setShowSuccess(true); // Show success message
      setTimeout(() => setShowSuccess(false), 3000); // Hide after 3 seconds
      setUser({ type: "admin", username: "", password: "" }); // Reset form
    } catch (error) {
      setShowError('An error occurred while adding the user.');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Add User</h2>
        <h2>(Admin/Tourism Governor)</h2>

        <label>
          Role:
          <select name="type" value={user.type} onChange={handleInputChange}>
            <option value="admin">Admin</option>
            <option value="tourismGovernor">Tourism Governor</option>
          </select>
        </label>
        <br />

        <label>
          Username:
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />

        <label>
          Password:
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />

        <button type="submit">Add User</button>

        {/* Popup Success Message */}
        {showSuccess && (
          <div className="success-popup">User created successfully!</div>
        )}

        {/* Popup Error Message */}
        {showError && (
          <div className="error-popup">{showError}</div>
        )}
      </form>
    </div>
  );
};

 export default AddUser;
