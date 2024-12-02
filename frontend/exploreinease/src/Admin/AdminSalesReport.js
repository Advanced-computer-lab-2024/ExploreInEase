import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    TextField,
    CircularProgress,
    Box,
    Grid
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#1261A0",
        color: "white",
        fontWeight: "bold",
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const SalesReport = () => {
    const [sales, setSales] = useState([
        {
            id: 1,
            product: "Gift Shop Item A",
            event: "Event A",
            date: "2024-12-01",
            revenue: 100,
        },
        {
            id: 2,
            product: "Itinerary B",
            event: "Event B",
            date: "2024-12-05",
            revenue: 200,
        },
        {
            id: 3,
            product: "Gift Shop Item C",
            event: "Event C",
            date: "2024-11-28",
            revenue: 150,
        },
    ]);
    const [filteredSales, setFilteredSales] = useState(sales);
    const [filterCriteria, setFilterCriteria] = useState({
        product: "",
        date: "",
        month: "",
    });
    const [viewDetails, setViewDetails] = useState(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        // Simulate loading data
        setTimeout(() => setLoaded(true), 1000);
    }, []);

    useEffect(() => {
        let filtered = sales;

        if (filterCriteria.product) {
            filtered = filtered.filter((sale) =>
                sale.product.toLowerCase().includes(filterCriteria.product.toLowerCase())
            );
        }

        if (filterCriteria.date) {
            filtered = filtered.filter((sale) => sale.date === filterCriteria.date);
        }

        if (filterCriteria.month) {
            filtered = filtered.filter(
                (sale) =>
                    new Date(sale.date).getMonth() + 1 === parseInt(filterCriteria.month)
            );
        }

        setFilteredSales(filtered);
    }, [filterCriteria, sales]);

    const handleFilterChange = (field, value) => {
        setFilterCriteria((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleViewDetails = (sale) => {
        setViewDetails(sale);
    };

    const handleCloseDetailsDialog = () => {
        setViewDetails(null);
    };

    return (
        <div>
            <h1>Sales Report</h1>

            {loaded ? (
                <div>
                    {/* Filter Inputs */}
                    <Box mb={3}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    label="Product Name"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    value={filterCriteria.product}
                                    onChange={(e) => handleFilterChange("product", e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    label="Month (1-12)"
                                    variant="outlined"
                                    size="small"
                                    type="number"
                                    inputProps={{ min: 1, max: 12 }}
                                    fullWidth
                                    value={filterCriteria.month}
                                    onChange={(e) => handleFilterChange("month", e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <TextField
                                    label="Date (YYYY-MM-DD)"
                                    variant="outlined"
                                    size="small"
                                    type="date"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    fullWidth
                                    value={filterCriteria.date}
                                    onChange={(e) => handleFilterChange("date", e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    backgroundColor="#1261A0"
                                    borderColor="#1261A0"
                                    onClick={() => setFilterCriteria({ product: "", date: "", month: "" })}
                                    sx={{ minWidth: "100px", padding: "5px 10px" }}
                                >
                                    Clear Filters
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Sales Table */}
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} size="small">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align="center">Product</StyledTableCell>
                                    <StyledTableCell align="center">Event</StyledTableCell>
                                    <StyledTableCell align="center">Date</StyledTableCell>
                                    <StyledTableCell align="center">Revenue</StyledTableCell>
                                    <StyledTableCell align="center"></StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredSales.map((sale) => (
                                    <TableRow key={sale.id} hover>
                                        <TableCell align="center">{sale.product}</TableCell>
                                        <TableCell align="center">{sale.event}</TableCell>
                                        <TableCell align="center">{sale.date}</TableCell>
                                        <TableCell align="center">${sale.revenue}</TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant="outlined"
                                                onClick={() => handleViewDetails(sale)}
                                            >
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Details Dialog */}
                    <Dialog
                        open={!!viewDetails}
                        onClose={handleCloseDetailsDialog}
                        fullWidth
                        maxWidth="sm"
                    >
                        <DialogTitle>Sale Details</DialogTitle>
                        <DialogContent>
                            {viewDetails && (
                                <>
                                    <Typography variant="body1">
                                        <strong>Product:</strong> {viewDetails.product}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Event:</strong> {viewDetails.event}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Date:</strong> {viewDetails.date}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Revenue:</strong> ${viewDetails.revenue}
                                    </Typography>
                                </>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDetailsDialog} color="primary">
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            ) : (
                <CircularProgress />
            )}
        </div>
    );
};

export default SalesReport;
