import { Grid, Button, Box } from '@mui/material';

const QuickActions = () => {
  const actions = [
    { label: "Add User", onClick: () => console.log("Add User") },
    { label: "Manage Complaints", onClick: () => console.log("Manage Complaints") },
    { label: "Create Event", onClick: () => console.log("Create Event") },
    { label: "View Reports", onClick: () => console.log("View Reports") },
  ];

  return (
    <Box sx={{ padding: 2, textAlign: 'center' }}>
      <Grid container spacing={3} justifyContent="center">
        {actions.map((action, index) => (
          <Grid item xs={12} sm={6} md={6} lg={6} key={index}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#1261A0",
                color: "white",
                minWidth: "150px",
                minHeight: "100px",
                padding: "12px",
                textTransform: "capitalize",
                fontWeight: "bold",
                '&:hover': {
                  backgroundColor: "#0e4a7d",
                },
              }}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default QuickActions;
