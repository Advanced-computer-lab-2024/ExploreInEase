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





const ComplaintsTable = () => { 


    const [complaints,setComplaint]=useState([
        {title:"complaint1",body:"complaint1 body",phone:"123456789",address:"address1",_id:"1"},
        {title:"complaint2",body:"complaint2 body",phone:"123456789",address:"address2",_id:"2"},
        {title:"complaint3",body:"complaint3 body",phone:"123456789",address:"address3",_id:"3"},
        



        // {"_id":"1","title":"complaint1","body":"complaint1 body"},
        // {"_id":"2","title":"complaint2","body":"complaint2 body"},
        // {"_id":"3","title":"complaint3","body":"complaint3 body"},

        


    ])


    // useEffect(() => {
    
    //     const getComplaints=  async () => {
            
    //       const res = await axios.get(`http://localhost:8000/filter?userId=}`)
    //       .then(response => {
    //           setComplaint(response.data);
    //       })
    //       .catch(err => console.log(err));

    //       console.log(res);
      
    //     }

    //     getComplaints()
    
    // }, [])

    // const params = new URLSearchParams(window.location.search);
    // const userId = params.get('userId');
    // console.log(userId);

    
    return(
       
        // visualize authors in a table map over authors
        <div className="UsersList">
           
         
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Name</StyledTableCell>
            <StyledTableCell align="center">Email</StyledTableCell>
            <StyledTableCell align="center">Phone</StyledTableCell>
            <StyledTableCell align="center">Address</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {complaints.map((complaint) => (
            <TableRow
            hover
            sx={{
                "&:hover":{
                cursor: "pointer",
                backgroundColor: "#f5f5f5",
                width: "100%"
                }
            }}
            onClick={() => window.location.href=`/filter?userId=${complaint._id}`}
              key={complaint._id}

              >
              <TableCell align="center">{complaint.title}</TableCell>
              <TableCell align="center">{complaint.body}</TableCell>
                <TableCell align="center">{complaint.phone}</TableCell>
                <TableCell align="center">{complaint.address}</TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
          
        </div>
                

    );
};

////////////////////// YOUR CODE HERE //////////////////////

export default ComplaintsTable;