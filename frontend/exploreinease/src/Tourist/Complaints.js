import React, { useState } from 'react';
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
  const { User } = location.state || {};
  console.log("admin",User);
  //const userId = User._id;
    // Separate state for form data and complaints list
    const [formData, setFormData] = useState({
        title: '',
        body: '',
        date: new Date().toISOString().split('T')[0]
    });
    
    // State for list of complaints
    const [complaints, setComplaints] = useState([
        {
            title: "Sample Complaint 1",
            body: "This is a sample complaint body text.",
            date: "2024-03-01"
        },
        {
            title: "Sample Complaint 2",
            body: "Another sample complaint description.",
            date: "2024-03-15"
        }
    ]);

    const [openCreate, setOpenCreate] = useState(false);
    const [errors, setErrors] = useState({});

    const handleClose = () => {
        setOpenCreate(false);
        setFormData({
            title: '',
            body: '',
            date: new Date().toISOString().split('T')[0]
        });
        setErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleComplaintSubmit = () => {
        // Validate form data
        const newErrors = {};
        if (!formData.title) newErrors.title = 'Title is required';
        if (!formData.body) newErrors.body = 'Description is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        // const option = {
        //     apiPath: `/fileComplaint`,
        //     urlParam: userId,
        //     body: newComplaint
        //   }
        //   const response = NetworkService.post(option);
        //   console.log(response);

        // Add new complaint to the list
        const newComplaint = {
            ...formData,
            date: new Date().toISOString().split('T')[0]
        };
        
        setComplaints(prevComplaints => [...prevComplaints, newComplaint]);
        handleClose();
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
                {complaints.map((complaint, index) => (
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
                            <p style={{ fontSize: '14px', color: '#666' }}>
                                {new Date(complaint.date).toLocaleDateString()}
                            </p>
                        </div>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{complaint.body}</p>
                    </div>
                ))}

                {complaints.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '32px', color: '#666' }}>
                        No complaints filed yet.
                    </div>
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
                        name="body"
                        value={formData.body}
                        onChange={handleInputChange}
                        fullWidth
                        multiline
                        rows={4}
                        error={!!errors.body}
                        helperText={errors.body}
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