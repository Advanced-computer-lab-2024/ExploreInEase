import React, { useState } from 'react';
import {
    TextField,
    Card,
    CardContent,
    Typography,
    Grid,
    Slider,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Button,
    Box,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    List,
    ListItem,
    ListItemText, Divider,
} from '@mui/material';

const Complaints = () => {
    const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [openCreate, setOpenCreate] = useState(false);

    const [complaintData, setComplaintData] = useState({
        title: '',
        body: '',
        date: new Date().toISOString().split('T')[0]
    });
    const handleClose = () => {
        setOpenCreate(false);
        setComplaintData({
            title: '',
            body: '',
        });
        setErrors({});
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setComplaintData({ ...complaintData, [name]: value });
    };
    const handleSubmitCreate = () => {
        console.log(complaintData);

        // if (validateForm()) {
        const newComplaint = {
            title: complaintData.title,
            body: complaintData.body,
        };
        //   const option = {
        //     apiPath: `/addProduct/${userId}`,
        //     urlParam: userId,
        //     body: newComplaint
        //   }
        //   const response = NetworkService.post(option);
        //   console.log(response);
        // setComplaintData((prev) => [...prev, newComplaint]);
        //   console.log(products);

        //   setNextId((prev) => prev + 1);
        handleClose();

    };

    // Sample complaints data - in real app, this would come from props or context
    const sampleComplaints = [
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
    ];

    const handleComplaintSubmit = () => {
        // Handle submission logic here
        console.log('Submitting complaint:', complaintData);
        setOpenCreate(false);
        setComplaintData({
            title: complaintData.title,
            body: complaintData.body,
            date: new Date().toISOString().split('T')[0]
        });
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
                {sampleComplaints.map((complaint, index) => (
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

                {sampleComplaints.length === 0 && (
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
                        value={complaintData.title || ''}
                        onChange={handleInputChange}
                        fullWidth
                        error={!!errors.name}
                        helperText={errors.name}
                    />

                    <TextField
                        margin="dense"
                        label="Problem"
                        name="body"
                        value={complaintData.body || ''}
                        onChange={handleInputChange}
                        fullWidth
                        error={!!errors.description}
                        helperText={errors.description}
                    />
                    

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleComplaintSubmit} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Complaints;