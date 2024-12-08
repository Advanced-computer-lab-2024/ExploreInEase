import React, { useState, useEffect } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    Typography, TextField, CircularProgress, Box, Grid, Card, CardContent
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]; // Colors for different revenue categories

const SalesReport = () => {
    const [sales, setSales] = useState([]);
    const [filteredSales, setFilteredSales] = useState([]);
    const [filterCriteria, setFilterCriteria] = useState({
        product: "",
        date: "",
        month: "",
    });
    const [viewDetails, setViewDetails] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [pieData, setPieData] = useState([]); // State to hold pie chart data

    const [totalRev, setTotalRev] = useState(0);

    useEffect(() => {
        let UserId = localStorage.getItem("UserId");

        const getSalesReport = async () => {
            try {
                const response = await axios.get(`http://localhost:3030/adminReport/${UserId}`);
                const data = response.data;

                console.log(data);

                setTotalRev(data.totalRevenue);

                // Prepare pie chart data
                const tempPieData = [
                  { name: "Activity", value: data.ActivityRevenue || 0 },
                  { name: "Historical Place", value: data.HistoricalPlaceRevenue || 0 },
                  { name: "Itinerary", value: data.ItineraryRevenue || 0 },
                  { name: "Orders", value: data.OrdersRevenue || 0 }
                ];
                setPieData(tempPieData);

                // Transform productRevenueByMonth into an array of sales entries
                const productRevenueByMonth = data.productRevenueByMonth || {};
                
                let transformedSales = [];
                let idCounter = 1;

                const monthMap = {
                    "January": "01",
                    "February": "02",
                    "March": "03",
                    "April": "04",
                    "May": "05",
                    "June": "06",
                    "July": "07",
                    "August": "08",
                    "September": "09",
                    "October": "10",
                    "November": "11",
                    "December": "12"
                };

                for (const productName in productRevenueByMonth) {
                    const monthlyData = productRevenueByMonth[productName];
                    for (const monthName in monthlyData) {
                        const year = "2024";
                        const monthNumber = monthMap[monthName] || "01"; 
                        const dateStr = `${year}-${monthNumber}-01`;

                        transformedSales.push({
                            id: idCounter++,
                            product: productName,
                            date: dateStr,
                            revenue: monthlyData[monthName]
                        });
                    }
                }

                setSales(transformedSales);
                setFilteredSales(transformedSales);
                setLoaded(true);
            } catch (error) {
                console.log(error);
            }
        };
        getSalesReport();
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
                (sale) => new Date(sale.date).getMonth() + 1 === parseInt(filterCriteria.month)
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
                        {/* Add the total revenue label here, just after you check that data is loaded */}
    <Box mb={2}>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        Total Revenue: ${totalRev}
      </Typography>
    </Box>
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
                                    onClick={() => setFilterCriteria({ product: "", date: "", month: "" })}
                                    sx={{ minWidth: "100px", padding: "5px 10px" }}
                                >
                                    Clear Filters
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            {/* Sales Table */}
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} size="small">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell align="center">Product</StyledTableCell>
                                            <StyledTableCell align="center">Date</StyledTableCell>
                                            <StyledTableCell align="center">Revenue</StyledTableCell>
                                            <StyledTableCell align="center"></StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredSales.map((sale) => (
                                            <TableRow key={sale.id} hover>
                                                <TableCell align="center">{sale.product}</TableCell>
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
                        </Grid>

                        <Grid item xs={12} md={4}>
                            {/* Pie Chart for Revenue */}
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Revenue Breakdown
                                    </Typography>
                                    <Box sx={{ height: 300 }}>
                                        <PieChart width={300} height={300}>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                paddingAngle={5}
                                                dataKey="value"
                                                label
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={COLORS[index % COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

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
