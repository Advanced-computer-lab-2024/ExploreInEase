import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Alert } from '@mui/material'; 
import { Tooltip, IconButton } from '@mui/material';
import { Typography, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Menu, MenuItem } from '@mui/material';
import dayjs from 'dayjs';
import SortIcon from '@mui/icons-material/Sort';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CircularProgress from '@mui/material/CircularProgress';
//
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    // Styling for table header cells
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: '#1261A0', // Updated background color for the header
      color: 'white',            // Updated text color for the header
      fontWeight: 'bold',        // Optional: Makes header text bold
    },
    // Styling for table body cells
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,              // Retain the same font size for body cells
    },
  }));

////////////////////// YOUR CODE HERE //////////////////////



let adminid = localStorage.getItem('UserId');


const RegistringUsers = () => {

    const [anchorEl, setAnchorEl] = useState(null);



    const [users, setUsers] = useState([


        {
            "users": [],
            "tourists": []
        }




    ])

    const [loaded, setLoaded] = useState(false);


    const [optionsAnchorEl, setOptionsAnchorEl] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {

        const getReqs = async () => {

            const res = await axios.get(`http://localhost:3030/notAcceptedUsers`)            
                .then(response => {
                    setUsers(response.data);
                    console.log(response.data);
                    setLoaded(true);
                })
                .catch(err => console.log(err));
        }

        getReqs()

    }, [loaded]);
    useEffect(() => {
        if (showSuccessMessage) {
          const timer = setTimeout(() => {
            setShowSuccessMessage(false);
          }, 5000);
          return () => clearTimeout(timer);
        }
      }, [showSuccessMessage]);
      
      useEffect(() => {
        if (showErrorMessage) {
          const timer = setTimeout(() => {
            setShowErrorMessage(false);
          }, 5000);
          return () => clearTimeout(timer);
        }
      }, [showErrorMessage]);

    const [selectedUserId, setSelectedUserId] = useState(null);

    const handleOptionsClick = (event, id) => {
        setAnchorEl(event.currentTarget);
        setSelectedUserId(id); // Set the selected user ID
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedUserId(null); // Clear the selected user ID
    };

    // Accept and Reject handlers
    const handleAccept = async() => {
        console.log("Complaint accepted" , selectedUserId);

        await axios.put(`http://localhost:3030/user/updatingStatus/${selectedUserId}/accepted`).then(response => {
            console.log(response.data);
            console.log(response);
            setSuccessMessage("Complaint accepted Successfully!");
            setShowSuccessMessage(true);
            setLoaded(false);
        }).catch(err => {console.log(err);
            setErrorMessage(err.response?.data?.message || 'An error occurred');
            setShowErrorMessage(true);});
        handleClose(); // Close the menu after action
    };

    const handleReject = async() => {
        console.log("Complaint rejected", selectedUserId);

        await axios.put(`http://localhost:3030/user/updatingStatus/${selectedUserId}/rejected`).then(response => {
            console.log(response.data);
            setLoaded(false);
            setSuccessMessage("Complaint rejected Successfully!");
            setShowSuccessMessage(true);
        }).catch(err => {
            console.log(err);
            setErrorMessage(err.response?.data?.message || 'An error occurred');
            setShowErrorMessage(true);
        });

    };


    const handleOpenFile = async (event, id) => {
        console.log("Opening file", id);

        window.open(`http://localhost:3030/viewDocument/${id}`);


        // await axios.get(`http://localhost:3030/viewDocument/${id}`).then(response => {
        //     console.log(response);
        //     window.open(`http://localhost:3030/viewDocument/${id}`);

        // }).catch(err => console.log(err));


    }





    return (

        // visualize authors in a table map over authors
        <div className="UsersList">
            <h1>Registring Accounts</h1>

            {
                loaded ? <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">Username</StyledTableCell>
                                <StyledTableCell align="center">Email</StyledTableCell>
                                <StyledTableCell align="center">Type</StyledTableCell>
                                <StyledTableCell align="center">Documents</StyledTableCell>
                                <StyledTableCell align="center"> </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow
                                    hover
                                    sx={{
                                        "&:hover": {
                                            cursor: "pointer",
                                            backgroundColor: "#f5f5f5",
                                            width: "100%"
                                        }
                                    }}
                                    key={user._id}

                                >
                                    <TableCell align="center">{user.username}</TableCell>
                                    <TableCell align="center">{user.email}</TableCell>
                                    <TableCell align="center">{user.type}</TableCell>
                                    <TableCell align="center">
                                    <Button
                                    onClick={(event)=>{handleOpenFile(event, user.documents.nationalId)}}
                                    > View National ID</Button>
                                     <Button
                                    onClick={(event)=>{

                                        if(user?.documents?.taxation ){
                                            handleOpenFile(event, user?.documents?.taxation)
                                        }else{
                                        
                                        handleOpenFile(event, user?.documents?.certificate)
                                    
                                        }
                                    }}
                                    >{user.documents?.taxation?  "View Taxation" : "View Certificate"}</Button>




                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={(event)=>{ handleOptionsClick(event, user._id)}}>
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl)}
                                            onClose={handleClose}
                                        >
                                            <MenuItem onClick={()=>{handleAccept()}}>Accept</MenuItem>
                                            <MenuItem onClick={()=>{handleReject()}}>Reject</MenuItem>
                                        </Menu>



                                    </TableCell>

                                </TableRow>
                            ))}

                            



                        </TableBody>
                    </Table>

                </TableContainer> : <h1>Loading...</h1>}

            <div> {showSuccessMessage && (
        <Alert severity="success" 
        sx={{
          position: 'fixed',
          top: 80, // You can adjust this value to provide space between success and error alerts
          right: 20,
          width: 'auto',
          fontSize: '1.2rem', // Adjust the size
          padding: '16px',
          zIndex: 9999, // Ensure it's visible above other content
        }}>
          {successMessage}
        </Alert>
      )}
      {showErrorMessage && (
        <Alert severity="error" 
        sx={{
          position: 'fixed',
          top: 60, // You can adjust this value to provide space between success and error alerts
          right: 20,
          width: 'auto',
          fontSize: '1.2rem', // Adjust the size
          padding: '16px',
          zIndex: 9999, // Ensure it's visible above other content
        }}>
          {errorMessage}
        </Alert>
      )}</div>

        </div>


    );
};

////////////////////// YOUR CODE HERE //////////////////////

export default RegistringUsers;