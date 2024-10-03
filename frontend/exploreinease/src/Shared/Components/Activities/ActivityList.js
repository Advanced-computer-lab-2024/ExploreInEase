// src/components/ActivityList.js
import React, { useState } from "react";

const ActivityList = () => {
  // Mock data representing created activities, itineraries, museums, and historical places
  const [data, setData] = useState({
    activities: [
      { id: 1, name: "Hiking Adventure", createdBy: "Advertiser" },
      { id: 2, name: "River Rafting", createdBy: "Advertiser" }
    ],
    itineraries: [
      { id: 1, name: "London City Tour", createdBy: "Tour Guide" },
      { id: 2, name: "Weekend Adventure", createdBy: "Tour Guide" }
    ],
    museums: [
      { id: 1, name: "British Museum", createdBy: "Tourism Governor" },
      { id: 2, name: "Natural History Museum", createdBy: "Tourism Governor" }
    ],
    historicalPlaces: [
      { id: 1, name: "Stonehenge", createdBy: "Tourism Governor" },
      { id: 2, name: "Tower of London", createdBy: "Tourism Governor" }
    ]
  });

  const [userRole, setUserRole] = useState(""); // Initial role is empty
  const [selectedItems, setSelectedItems] = useState([]);

  // Function to handle role selection
  const handleRoleChange = (role) => {
    setUserRole(role);
    if (role === "Advertiser") {
      setSelectedItems(data.activities);
    } else if (role === "Tour Guide") {
      setSelectedItems(data.itineraries);
    } else if (role === "Tourism Governor") {
      setSelectedItems([...data.museums, ...data.historicalPlaces]); // Combine museums and historical places
    }
  };

  return (
    <div className="activity-list">
      <h2>Select Your Role</h2>
      <select
        value={userRole}
        onChange={(e) => handleRoleChange(e.target.value)}
        className="role-select"
      >
        <option value="" disabled>Select your role</option>
        <option value="Advertiser">Advertiser</option>
        <option value="Tour Guide">Tour Guide</option>
        <option value="Tourism Governor">Tourism Governor</option>
      </select>

      {userRole && (
        <>
          <h2>{userRole}'s Created Items</h2>
          {selectedItems.length === 0 ? (
            <p>No items found for your role.</p>
          ) : (
            <ul>
              {selectedItems.map((item) => (
                <li key={item.id}>
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default ActivityList;
