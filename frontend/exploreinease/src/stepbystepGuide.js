import React from 'react';
import HomePage from './Guest/GuestNavbar';
const stepbystepGuide=()=>{ 
return(
    <div>
        <HomePage/>
      <video width="600" controls>
        <source src="path-to-your-video-file.mp4" type="video/mp4" />
                Your browser does not support the video tag.
      </video>
    </div>
);
};
export default stepbystepGuide;