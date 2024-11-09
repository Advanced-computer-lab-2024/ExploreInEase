import React, { useState,useEffect } from 'react';
import {
    TextField,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import NetworkService from '../NetworkService';

const Complaints = () => {  
    const location = useLocation();
    const { events, User } = location.state || {};
    console.log("admin", User);
    const userId = User._id;
    console.log(events)
    // Separate state for form data and complaints list
    const [formData, setFormData] = useState({
        title: '',
        problem: '',
        date: new Date().toISOString().split('T')[0]
    });
    // State for list of complaints
    const [complaints, setComplaints] = useState([]);
    const [eventss, setEventss] = useState([]);
    const [shouldFetchComplaints, setShouldFetchComplaints] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [errors, setErrors] = useState({});
    useEffect(() => {
        fetchComplaints();
      }, shouldFetchComplaints);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        console.log(formData.problem)
    };
    const handleClose = () => {
        setOpenCreate(false);
        setFormData({
            title: '',
            problem: '',
            date: new Date().toISOString().split('T')[0]
        });
        setErrors({});
    };
    const handleComplaintSubmit =async()=> {
        setShouldFetchComplaints(false);
        const newComplaint = {
            ...formData,
            date: new Date().toISOString().split('T')[0]
        };
        console.log(formData.problem)
        console.log(formData)
        console.log(newComplaint.title)
        const option = {
            apiPath: `/fileComplaint/${userId}/${newComplaint.problem}/${newComplaint.title}`,
            urlParam: userId, urlParam: newComplaint.problem, urlParam: newComplaint.title
        }
        try {
            const response = await NetworkService.post(option);
            console.log(response);

            
                // Toggle the `shouldFetchComplaints` state to re-trigger useEffect
                setShouldFetchComplaints((prev) => !prev);
                handleClose();
            
        } catch (error) {
            console.error("Error filing complaint:", error);
            // Handle errors here if needed
        }                    
    };
    const fetchComplaints=async()=>{
        try { 
            const options = {
              apiPath: `/myComplaints/${userId}`,
              urlParam:userId
  
            };
            const response = await NetworkService.get(options);
            // setSuccess(response.message); // Set success message
            console.log(response);
            const events=response.data;
            setEventss(events);
            console.log("event",events)
          } catch (err) {
            if (err.response) {
                console.log(err.message);
            //   setError(err.response.data.message); // Set error message from server response if exists
            } else {
              console.log('An unexpected error occurred.');
               // Generic error message
            }
          }
    }

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>My Complaints</h1>
                <button
                    onClick={() => setOpenCreate(true)}
                    style={{
                        padding: '10px 25px',
                        backgroundColor: '#0066cc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    File a Complaint
                </button>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
                {eventss === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px', color: '#666' }}>
                        No complaints available.
                    </div>
                ) : (
                    eventss.map((complaint, index) => (
                        <div key={index} style={{
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            padding: '20px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
                        }}>
                            <div style={{ marginBottom: '12px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
                                    {complaint.title}
                                </h3>
                                <p style={{ whiteSpace: 'pre-wrap' }}>{complaint.problem}</p>

                                <p style={{ whiteSpace: 'pre-wrap' }}>{complaint.dateOfComplaint}</p>

                            </div>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{complaint.status}</p>

                        </div>
                    ))
                )}


            </div>

            {/* File Complaint Dialog */}
            <Dialog open={openCreate} onClose={handleClose}>
                <DialogTitle>File New Complaint</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please fill in the details to file a new complaint.
                    </DialogContentText>
                    <TextField
                        margin="dense"
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        fullWidth
                        error={!!errors.title}
                        helperText={errors.title}
                    />

                    <TextField
                        margin="dense"
                        label="Problem"
                        name="problem"
                        value={formData.problem}
                        onChange={handleInputChange}
                        fullWidth
                        multiline
                        rows={4}
                        error={!!errors.problem}
                        helperText={errors.problem}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleComplaintSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Complaints;