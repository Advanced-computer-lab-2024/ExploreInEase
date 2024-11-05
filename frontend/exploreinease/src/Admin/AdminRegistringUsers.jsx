import React, { useState,useEffect } from 'react';
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





const RegistringUsers = () => { 


    const [users,setUsers]=useState([])


    useEffect(() => {
    
        const getComplaints=  async () => {
            
          const res = await axios.get(`http://localhost:8000/filter?userId=}`)
          .then(response => {
              setUsers(response.data);
          })
          .catch(err => console.log(err));

          console.log(res);
      
        }

        getComplaints()
    
    }, [])

    const params = new URLSearchParams(window.location.search);
    const userId = params.get('userId');
    console.log(userId);

    
    return(
       
        // visualize authors in a table map over authors
        <div className="UsersList">
           
         
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Name</StyledTableCell>
            <StyledTableCell align="center">Email</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow
            hover
            sx={{
                "&:hover":{
                cursor: "pointer",
                backgroundColor: "#f5f5f5",
                width: "100%"
                }
            }}
            onClick={() => window.location.href=`/filter?userId=${user._id}`}
              key={user._id}

              >
              <TableCell align="center">{user.title}</TableCell>
              <TableCell align="center">{user.body}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
          
        </div>
                

    );
};

////////////////////// YOUR CODE HERE //////////////////////

export default RegistringUsers;