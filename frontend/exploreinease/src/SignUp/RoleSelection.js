import React, { useState } from 'react';
import GuideAdvertiserSignUp from './AdvertiserSignUp'; // Ensure the path is correct
import TouristSignUp from './TouristSignUp'; // Ensure this component exists

const RoleSelection = () => {
  const [role, setRole] = useState(''); // No initial role selected

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Sign Up</h1>
      {/* Buttons for role selection */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <button
          style={{
            margin: '10px',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            backgroundColor: '#007bff',
            color: 'white',
            transition: 'background-color 0.3s',
          }}
          className={role === 'tourist' ? 'active' : ''}
          onClick={() => handleRoleChange('tourist')}
        >
          Register as Tourist
        </button>
        <button
          style={{
            margin: '10px',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            backgroundColor: '#007bff',
            color: 'white',
            transition: 'background-color 0.3s',
          }}
          className={role === 'guideAdvertiser' ? 'active' : ''}
          onClick={() => handleRoleChange('guideAdvertiser')}
        >
          Register as Tour Guide / Advertiser / Seller
        </button>
      </div>

      {/* Conditionally render the form based on the selected role */}
      {role && (
        <div className="form-content">
          {role === 'tourist' ? <TouristSignUp /> : <GuideAdvertiserSignUp />}
        </div>
      )}
    </div>
  );
};

export default RoleSelection;