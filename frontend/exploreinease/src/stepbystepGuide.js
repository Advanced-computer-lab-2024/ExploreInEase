import React from 'react';
import HomePage from './Guest/GuestNavbar';
import ReactPlayer from 'react-player';
import myVideo from '../src/stepbystep.mp4';

const StepByStepGuide = () => {
  return (
    <div>
      <HomePage />
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
        <ReactPlayer
          url={myVideo}
          controls
          width="850px"
          height="450px"
          playing={true} // Autoplay disabled by default
          loop={false} // Looping disabled by default
          muted={false} // Unmuted by default
        />
      </div>
    </div>
  );
};

export default StepByStepGuide;
