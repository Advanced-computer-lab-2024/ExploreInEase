// src/components/AddUser.js
import React, { useState } from "react";
import './AddUser.css'; // Import the CSS file for styling

const AddUser = () => {
  const [user, setUser] = useState({
    type: "Admin", // Default role as Admin
    username: "",
    password: "",
  });

  const [showSuccess, setShowSuccess] = useState(false); // To handle success popup

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd send this data to a server
    console.log("User added:", user);
    setShowSuccess(true); // Show the success message
    setTimeout(() => setShowSuccess(false), 3000); // Hide after 3 seconds
    setUser({ type: "Admin", username: "", password: "" }); // Reset form
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Add User</h2>
        <h2>(Admin/Tourism Governor)</h2>

        <label>
          Role:
          <select name="type" value={user.type} onChange={handleInputChange}>
            <option value="Admin">Admin</option>
            <option value="Tourism Governor">Tourism Governor</option>
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
          <div className="success-popup">
            User created successfully!
          </div>
        )}
      </form>
    </div>
  );
};

export default AddUser;
