import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Alert
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import NetworkService from '../NetworkService';

const Complaints = () => {
    const location = useLocation();
    const { userId } = location.state || {};

    const [formData, setFormData] = useState({
        title: '',
        problem: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [complaints, setComplaints] = useState([]);
    const [openCreate, setOpenCreate] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchComplaints();
    }, []);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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

    const handleComplaintSubmit = async () => {
        const newComplaint = {
            ...formData,
            date: new Date().toISOString().split('T')[0]
        };
        
        const option = {
            apiPath: `/fileComplaint/${userId}/${newComplaint.problem}/${newComplaint.title}`,
            urlParam: userId
        };

        try {
             await NetworkService.post(option);
            setSuccessMessage("Complaint added successfully!");
            setShowSuccessMessage(true);

            // Directly add the new complaint to the list
            setComplaints(prevComplaints => [...prevComplaints, newComplaint]);
            handleClose();
        } catch (error) {
            setErrorMessage('An error occurred');
            setShowErrorMessage(true);
            console.error("Error filing complaint:", error);
        }
    };

    const fetchComplaints = async () => {
        try {
            const options = {
                apiPath: `/myComplaints/${userId}`,
                urlParam: userId
            };
            const response = await NetworkService.get(options);
            setComplaints(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error('Error fetching complaints:', err);
            setComplaints([]); // Set to an empty array in case of error
        }
    };
    

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
                {complaints.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px', color: '#666' }}>
                        No complaints available.
                    </div>
                ) : (
                    complaints.map((complaint, index) => (
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
                                <p style={{ whiteSpace: 'pre-wrap' }}>{complaint.date}</p>
                            </div>
                            <p style={{ whiteSpace: 'pre-wrap' }}>{complaint.status}</p>
                        </div>
                    ))
                )}
            </div>

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
            {showSuccessMessage && (
                <Alert severity="success" sx={{ position: 'fixed', top: 80, right: 20, width: 'auto', fontSize: '1.2rem', padding: '16px', zIndex: 9999 }}>
                    {successMessage}
                </Alert>
            )}
            {showErrorMessage && (
                <Alert severity="error" sx={{ position: 'fixed', top: 60, right: 20, width: 'auto', fontSize: '1.2rem', padding: '16px', zIndex: 9999 }}>
                    {errorMessage}
                </Alert>
            )}
        </div>
    );
};

export default Complaints;
