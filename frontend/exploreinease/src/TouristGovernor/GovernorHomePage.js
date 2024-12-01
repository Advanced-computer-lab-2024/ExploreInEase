import GovernorNavbar from './GovernorNavbar';
import { FaCar, FaUserCircle, FaTasks, FaRoute } from 'react-icons/fa'; // Example icon library
import NetworkService from '../NetworkService';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import "./GovernorHomePage.css"; // Import CSS file for styling
import { Navigate, useNavigate } from 'react-router-dom';

const GovernorHomePage = () => {
    const Userr = JSON.parse(localStorage.getItem('User'));
    const navigate=useNavigate();
    const handleClick=async(title)=>{
        // console.log("herereee");
        
        const governorId=Userr?._id;

        if (title=="Historical Places"){ 
            console.log("herereee");

            try{
                const options = 
                {
                  apiPath: `/historical-places/${governorId}/allHistoricalPlaces`,
                };
                const response1 = await NetworkService.get(options);
                const response = response1.filter(item=>item.created_by.toString()===governorId);
                navigate(`/HistoricalPlaces`,{state:{governorId,response}});   
              } 
            catch {
              console.log('An unexpected error occurred.'); // Generic error message
            }     
        }else if (title=="Historical Tags"){
            navigate(`/viewHistoricalTags`,{state:{governorId}});          

        }else if (title=="Change Password"){
            navigate('/change-password', { state: { userId:governorId}});;

        }else if (title=="Log Out") {
            navigate('/');
        }
    }
  return (
    <div className="HomePage">
      <div>
        <GovernorNavbar />
      </div>
      <div className="photo-background" />

      <div className="card-container">
        {/* Card 1 - Activity */}
        <div className="card">
          <div className="card-icon">
            <FaTasks /> {/* You can change the icon to suit your needs */}
          </div>
          <button className="card-button" onClick={()=>handleClick("Historical Places")}>Historical Places</button>
        </div>

        {/* Card 2 - Transportation */}
        <div className="card">
          <div className="card-icon">
            <FaCar /> {/* Icon for Transportation */}
          </div>
          <button className="card-button" onClick={()=>handleClick("Historical Tags")}>Tags</button>
        </div>

        {/* Card 3 - My Profile */}
        <div className="card">
          <div className="card-icon">
            <FaUserCircle /> {/* Icon for Profile */}
          </div>
          <button className="card-button" onClick={()=>handleClick("Change Password")}>Change Password</button>
        </div>
        <div className="card">
          <div className="card-icon">
            <LogoutSharpIcon fontSize='large'/> {/* Icon for Profile */}
          </div>
          <button className="card-button" onClick={()=>handleClick("Log Out")}>Log Out</button>
        </div>
      </div>
    </div>
  );
};

export default GovernorHomePage;
