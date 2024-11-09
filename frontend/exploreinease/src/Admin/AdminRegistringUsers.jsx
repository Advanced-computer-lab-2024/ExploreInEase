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
import { Tooltip, IconButton } from '@mui/material';
import { Typography, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Menu, MenuItem } from '@mui/material';
import dayjs from 'dayjs';
import SortIcon from '@mui/icons-material/Sort';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CircularProgress from '@mui/material/CircularProgress';
//
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

////////////////////// YOUR CODE HERE //////////////////////



let adminid = '672bf691f67cfb02edc244bc';


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
            setLoaded(false);
        }).catch(err => console.log(err));
    




        handleClose(); // Close the menu after action
    };

    const handleReject = async() => {
        console.log("Complaint rejected", selectedUserId);

        await axios.put(`http://localhost:3030/user/updatingStatus/${selectedUserId}/rejected`).then(response => {
            console.log(response.data);
            setLoaded(false);
        }).catch(err => console.log(err));

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

                                        if(user.documents.taxation){
                                            handleOpenFile(event, user.documents.taxation)
                                        }else{
                                        
                                        handleOpenFile(event, user.documents.certificate)
                                    
                                        }
                                    }}
                                    >{user.documents.taxation?  "View Taxation" : "View Certificate"}</Button>




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



        </div>


    );
};

////////////////////// YOUR CODE HERE //////////////////////

export default RegistringUsers;