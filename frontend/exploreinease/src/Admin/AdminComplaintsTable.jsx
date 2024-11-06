import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import { styled } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Menu, MenuItem } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Tooltip, IconButton } from '@mui/material';
import {TextField,Box, Typography, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';

import dayjs from 'dayjs';
import SortIcon from '@mui/icons-material/Sort';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CircularProgress from '@mui/material/CircularProgress';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const ComplaintsTable = () => {
  const [complaints, setComplaints] = useState([
    // { title: "complaint1", body: "complaint1 body", date: "1/1/2001", status: "pending", _id: "1" },
    // { title: "complaint2", body: "complaint2 body", date: "1/1/2002", status: "pending", _id: "2" },
    // { title: "complaint3", body: "complaint3 body", date: "1/1/2003", status: "resolved", _id: "3" },
    // { title: "complaint4", body: "complaint4 body", date: "1/1/2004", status: "resolved", _id: "4" },
    // { title: "complaint3", body: "complaint3 body", date: "1/1/2003", status: "resolved", _id: "5" },
  ]);

  const [filteredComplaints, setFilteredComplaints] = useState(complaints);
  const [filter, setFilter] = useState("All");
  const [anchorEl, setAnchorEl] = useState(null);

  const [sortOrder, setSortOrder] = useState("asc"); // Initial sort order
  // const [anchorEl, setAnchorEl] = useState(null);
  const [optionsAnchorEl, setOptionsAnchorEl] = useState(null);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);

  const [loaded, setLoaded] = useState(false);


  const [complaintDetails, setComplaintDetails] = useState({})
  const [open, setOpen] = useState(false);

  const [replyOpen, setReplyOpen] = useState(false);

  const[reload,setReload]=useState(false);

  // Filter complaints based on the selected filter

  const adminid = "670d155eb76bcde6af078f3d";


  const [reply, setReply] = useState('');

  const handleReplyChange = (event) => {
    setReply(event.target.value);
  };

  const handleReplySubmit = async(complaint) => {
    console.log("Reply submitted:", reply);

   let  reqBody = {
      reply: reply
    }

    await axios.patch(`http://localhost:3030/replyComplaint/${complaint._id}?adminId=${adminid}`,reqBody).then((res) => {
      console.log(res.data);
      setLoaded(true);
      
      setReload(!reload);
    }
    ).catch((err) => {
      console.log(err);
    });

    handleOptionsClose();
    setReplyOpen(false);

    setReply(''); // Clear the input field after submitting
  };


  useEffect(() => {

    const getComplaints = async () => {
      axios.get(`http://localhost:3030/ViewComplaints?adminId=${adminid}`).then((res) => {
        console.log(res.data);
        setComplaints(res.data.complaints);
        setLoaded(true);
      }).catch((err) => {
        console.log(err);
      });
    }

    getComplaints();

  }, [reload]);


  // useEffect(() => {

  //   const getComplaints = async () => {
  //     axios.get(`http://localhost:3030/ViewComplaints?adminId=${adminid}`).then((res) => {
  //       console.log(res.data);
  //       setComplaints(res.data.complaints);
  //       setLoaded(true);
  //     }).catch((err) => {
  //       console.log(err);
  //     });
  //   }

  //   getComplaints();

  // }, []);


  useEffect(() => {


    if (filter === "All") {
      setFilteredComplaints(complaints);
    } else {
      setFilteredComplaints(complaints.filter(complaint => complaint.status === filter.toLowerCase()));
    }
  }, [filter, complaints]);

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = (status) => {
    setFilter(status);
    setAnchorEl(null);
  };

  const handleSortByDate = () => {
    const sortedComplaints = [...filteredComplaints].sort((a, b) => {
      const dateA = Date.parse(a.dateOfComplaint);
      const dateB = Date.parse(b.dateOfComplaint);
      
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    
    setFilteredComplaints(sortedComplaints);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Toggle sort order
  };
  
  


  const handleOptionsClick = (event, complaintId) => {
    setOptionsAnchorEl(event.currentTarget);
    setSelectedComplaintId(complaintId);
  };

  const handleOptionsClose = () => {
    setOptionsAnchorEl(null);
    setSelectedComplaintId(null);
  };

  const handleAction = (id, action) => {
    console.log(`Action: ${action} on Complaint ID: ${selectedComplaintId}`);
    handleOptionsClose();
  };



  const handleViewComplaint = (complaint) => {
    setComplaintDetails(complaint);
    setOpen(true);
    handleOptionsClose();
  };


  const handleReply = (complaint) => {
    setComplaintDetails(complaint);
    setReplyOpen(true);
    setOpen(false);
    handleOptionsClose();
  };


  const handleCloseDialog = () => {
    setOpen(false);
    setComplaintDetails({});
  };

  const handleCloseReplyDialog = () => {
    setReplyOpen(false);
    setComplaintDetails({});
  };




  const handleMark = async (complaint) => {
    console.log("Marking as resolved");

    setLoaded(false);

    let reqBody = {};

    if (complaint.status === "pending") {
      reqBody = {
        status: "resolved"
      }
    }
    else {
      reqBody = {
        status: "pending"
      }
    }

    await axios.patch(`http://localhost:3030/markComplaint/${complaint._id}?adminId=${adminid}`,reqBody).then((res) => {
      console.log(res.data);
      setLoaded(true);
      
      setReload(!reload);
    }
    ).catch((err) => {
      console.log(err);
    });

    handleOptionsClose();



  }



    return (
      <div className="UsersList">
        <h1>Complaints</h1>


      {loaded? 
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Tourist Name</StyledTableCell>
                <StyledTableCell align="center">Tourist Email</StyledTableCell>
                <StyledTableCell align="center">Title</StyledTableCell>

                <StyledTableCell align="center">Date
                  <Tooltip title={sortOrder === "asc" ? "Sort by Date DESC" : "Sort by Date ASC"} arrow>
                    <Button
                      sx={{ marginLeft: "8px", background: "white", minWidth: "10px", padding: "6px" }}
                      onClick={handleSortByDate}
                    >
                      <SortIcon sx={{ color: "black", fontSize: "16px" }} />
                    </Button>
                  </Tooltip>



                </StyledTableCell>
                <StyledTableCell align="center">
                  Status
                  <Tooltip title="Filter complaints based on status" arrow>

                    <Button sx={{
                      marginLeft: "8px",
                      background: "white",
                      width: "10px",
                      height: "15px",
                      minWidth: "10px",
                      padding: "12px"    // Adjust padding to make the button smaller
                    }} onClick={handleFilterClick}>
                      <FilterListIcon sx={{ color: "black", fontSize: "16px" }} />
                    </Button>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                  >
                    <MenuItem onClick={() => handleFilterClose("All")}>All</MenuItem>
                    <MenuItem onClick={() => handleFilterClose("Pending")}>Pending</MenuItem>
                    <MenuItem onClick={() => handleFilterClose("Resolved")}>Resolved</MenuItem>
                  </Menu>
                </StyledTableCell>
                <StyledTableCell align="center"></StyledTableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {filteredComplaints.map((complaint) => (
                <TableRow
                  hover
                  sx={{
                    "&:hover": {
                      cursor: "pointer",
                      backgroundColor: "#f5f5f5",
                      width: "100%"
                    }
                  }}
                  key={complaint._id}
                >
                  <TableCell align="center">{complaint.touristName}</TableCell>
                  <TableCell align="center">{complaint.touristEmail}</TableCell>
                  <TableCell sx={{maxWidth:"250px"}} align="center">{complaint.title}</TableCell>

                  <TableCell align="center">{dayjs(complaint.dateOfComplaint).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                  <TableCell align="center">{complaint.status}</TableCell>
                  <TableCell align="center"> <IconButton onClick={(event) => handleOptionsClick(event, complaint._id)}>
                    <MoreVertIcon />
                  </IconButton>
                    <Menu
                      anchorEl={optionsAnchorEl}
                      open={Boolean(optionsAnchorEl) && selectedComplaintId === complaint._id}
                      onClose={handleOptionsClose}
                    >
                      <MenuItem onClick={() => handleViewComplaint(complaint)}>view complaint</MenuItem>
                      <MenuItem onClick={() => handleMark(complaint)}>{complaint.status === 'pending' ? 'mark as resolved' : 'mark as pending'} </MenuItem>
                      <MenuItem onClick={() => handleReply(complaint)}>reply</MenuItem>
                    </Menu></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog open={open} onClose={handleCloseDialog}>
          <DialogTitle>Complaint Details</DialogTitle>
          <DialogContent>
            <Typography mb={1} variant="body1"><strong>Tourist Name:</strong> {complaintDetails.touristName}</Typography>
            <Typography mb={1} variant="body1"><strong>Tourist Email:</strong> {complaintDetails.touristEmail}</Typography>
            <Typography mb={1} variant="body1"><strong>Title:</strong> {complaintDetails.title}</Typography>
            <Typography mb={1} variant="body1"><strong>Problem:</strong> {complaintDetails.problem}</Typography>

            <Typography mb={1} variant="body1"><strong>Date of Complaint:</strong> {dayjs(complaintDetails.dateOfComplaint).format('YYYY-MM-DD HH:mm:ss')}</Typography>
            <Typography mb={1} variant="body1"><strong>Reply:</strong> {complaintDetails.reply}</Typography>

            <Typography mb={1} variant="body1"><strong>Status:</strong> {complaintDetails.status}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">Close</Button>
          </DialogActions>
        </Dialog>


        <Dialog  open={replyOpen} onClose={handleCloseReplyDialog}>
          <DialogTitle>Reply to complaint</DialogTitle>
          <DialogContent>
            <Typography mb={1} variant="body1"><strong>Tourist Name:</strong> {complaintDetails.touristName}</Typography>
            <Typography mb={1} variant="body1"><strong>Tourist Email:</strong> {complaintDetails.touristEmail}</Typography>
            <Typography mb={1} variant="body1"><strong>Title:</strong> {complaintDetails.title}</Typography>
            <Typography mb={1} variant="body1"><strong>Problem:</strong> {complaintDetails.problem}</Typography>

            <Typography mb={1} variant="body1"><strong>Date of Complaint:</strong> {dayjs(complaintDetails.dateOfComplaint).format('YYYY-MM-DD HH:mm:ss')}</Typography>
            <Typography mb={1} variant="body1"><strong>Status:</strong> {complaintDetails.status}</Typography>

            <Box>
      <Typography mb={1} variant="body1">Enter your reply:</Typography>
      
      <TextField 
        variant="outlined" 
        placeholder="Type your reply here..." 
        fullWidth 
        value={reply}
        onChange={handleReplyChange}
        multiline
        rows={4} // Adjust rows if you want a multi-line input
      />

      <Button 
        variant="contained" 
        
        sx={{ mt: 2,color:"white",backgroundColor:"black" }}
        onClick={() => handleReplySubmit(complaintDetails)}
      >
        Submit
      </Button>
    </Box>
          </DialogContent>
          <DialogActions>
            <Button  onClick={handleCloseReplyDialog} >Close</Button>
          </DialogActions>
        </Dialog>
        </div>
: <CircularProgress />}



      </div>
    );
  };

  export default ComplaintsTable;
