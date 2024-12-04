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


const DeletionRequests = () => {


    const [request, setRequest] = useState([
        // {title:"complaint1",body:"complaint1 body",phone:"123456789",address:"address1",_id:"1"},
        // {title:"complaint2",body:"complaint2 body",phone:"123456789",address:"address2",_id:"2"},
        // {title:"complaint3",body:"complaint3 body",phone:"123456789",address:"address3",_id:"3"},




        // {"_id":"1","title":"complaint1","body":"complaint1 body"},
        // {"_id":"2","title":"complaint2","body":"complaint2 body"},
        // {"_id":"3","title":"complaint3","body":"complaint3 body"},

        {
            "users": [],
            "tourists": []
        }




    ])

    const [loaded, setLoaded] = useState(false);

    // {
    //     "users": [
    //         {
    //             "photo": {
    //                 "logo": "670bee90e440e15fadd1b011-1730744911468.jpg",
    //                 "selfPicture": ""
    //             },
    //             "ratingSum": 0,
    //             "ratingCount": 0,
    //             "_id": "670bee90e440e15fadd1b011",
    //             "username": "saifSeller",
    //             "password": "saifPassword",
    //             "email": "saifSeller@gmail.com",
    //             "type": "seller",
    //             "comment": [],
    //             "termsAndConditions": true,
    //             "status": false,
    //             "requestDeletion": true,
    //             "sellerType": "External",
    //             "docStatus": "",
    //             "createdAt": "2024-10-13T16:00:16.890Z",
    //             "updatedAt": "2024-11-04T18:28:35.968Z"
    //         }
    //     ],
    //     "tourists": [
    //         {
    //             "_id": "6728ae72498a7809bca3949c",
    //             "username": "mahmoudHoda",
    //             "password": "Mahmoudhoda123",
    //             "mobileNum": "01023255440",
    //             "email": "mahmoudHoda@gmail.com",
    //             "nation": "Chinese",
    //             "dob": "2003-02-05T00:00:00.000Z",
    //             "profession": "Bitch 2",
    //             "bookmark": "",
    //             "points": 0,
    //             "redeemedPoints": 0,
    //             "wishlists": [],
    //             "wallet": 9966711,
    //             "archived": [],
    //             "requestDeletion": true,
    //             "itineraryId": [
    //                 {
    //                     "id": "6714310f96fd6b0095310d55",
    //                     "pricePaid": 120,
    //                     "_id": "6728b42cf4a53ddcfed99ae5"
    //                 },
    //                 {
    //                     "id": "672529eddd78dca8b022487d",
    //                     "pricePaid": 19,
    //                     "_id": "6728b461f4a53ddcfed99aed"
    //                 }
    //             ],
    //             "activityId": [
    //                 {
    //                     "id": "67155b3cceb8f43a577a762f",
    //                     "pricePaid": 16500,
    //                     "_id": "6728b85ff4a53ddcfed99af2"
    //                 },
    //                 {
    //                     "id": "67155b47ceb8f43a577a7636",
    //                     "pricePaid": 16500,
    //                     "_id": "6728b88cf4a53ddcfed99afc"
    //                 }
    //             ],
    //             "historicalplaceId": [
    //                 {
    //                     "id": "66fff38d16d4239c0c98c06d",
    //                     "pricePaid": 50,
    //                     "_id": "6728b91bf4a53ddcfed99b09"
    //                 },
    //                 {
    //                     "id": "6703ac6e7fa15ff2207446bb",
    //                     "pricePaid": 100,
    //                     "_id": "6728b945f4a53ddcfed99b12"
    //                 }
    //             ],
    //             "transportationId": [],
    //             "createdAt": "2024-11-04T11:22:26.969Z",
    //             "addresses": [],
    //             "updatedAt": "2024-11-04T12:08:37.814Z"
    //         }
    //     ]
    // }


    useEffect(() => {

        const getReqs = async () => {
            await axios.get(`http://localhost:3030/deletionrequests`)
                .then(response => {
                    setRequest(response.data);
                    console.log(response.data);
                    setLoaded(true);
                })
                .catch(err => console.log(err));
        }

        getReqs()

    }, [])

    // const params = new URLSearchParams(window.location.search);
    // const userId = params.get('userId');
    // console.log(userId);


    const handleDelete = async (id, userType) => {

        console.log(id);
        const reqBody = {
            _id: id,
            userType: userType,
            selfId: adminid

        }

        console.log(reqBody);

        await axios.delete(`http://localhost:3030/deleteUserByIdAndType`, { data: reqBody })
            .then(response => {
                console.log(response.data);
                const updatedRequest = {
                    users: request.users.filter((user) => user._id !== id),
                    tourists: request.tourists.filter((user) => user._id !== id)
                };
    
                setRequest(updatedRequest); // Update state with the new request object

            })
            .catch(err => console.log(err));
    }

    return (

        // visualize authors in a table map over authors
        <div className="UsersList">
            <h1>Account Deletion Requests</h1>

            {
                loaded ? <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">Username</StyledTableCell>
                                <StyledTableCell align="center">Email</StyledTableCell>
                                <StyledTableCell align="center">Type</StyledTableCell>
                                <StyledTableCell align="center"> </StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {request.users.map((user) => (
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

                                        <Button variant="contained" sx={{
                                            backgroundColor: 'black',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: 'grey.800', // Darker shade on hover
                                            }
                                        }} onClick={() => {
                                            handleDelete(user._id, user.type);
                                        }}>Delete</Button>

                                    </TableCell>

                                </TableRow>
                            ))}


                            {request.tourists.map((user) => (
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
                                    <TableCell align="center">{"tourist"}</TableCell>
                                    <TableCell align="center">

                                        <Button variant="contained" sx={{
                                            backgroundColor: 'black',
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: 'grey.800', // Darker shade on hover
                                            }
                                        }} onClick={() => {
                                            handleDelete(user._id, "tourist");
                                        }}>Delete</Button>
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer> : <h1>Loading...</h1>
            }


        </div>


    );
};

////////////////////// YOUR CODE HERE //////////////////////

export default DeletionRequests;