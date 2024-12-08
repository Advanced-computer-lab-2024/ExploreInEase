import { Container, Grid, Typography } from '@mui/material';
import OverviewCards from './Cards/OverViewCards';
import RecentActivities from './Cards/RecentActivities';
import GraphSection from './Cards/GraphSection';
import QuickActions from './QuickActions';
import UpcomingEvents from './UpcomingEvents';

const AdminHomePage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Overview Cards */}
      {/* Graph Section centered */}
      {/* <Grid container spacing={3} sx={{ mt: 4, justifyContent:'center' }}>
        <Grid item xs={12} md={8}>
          <GraphSection />
        </Grid>
        
      </Grid> */}

      {/* Graph Section and Quick Actions */}
      <Grid container spacing={3} sx={{ mt: 4, justifyContent:'center' }}>
        <Grid item xs={12} md={8}>
          <GraphSection />
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Notifications</Typography>
        <RecentActivities />

        </Grid>
      </Grid>

      {/* Recent Activities and Upcoming Events */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {/* <Grid item xs={12} md={6}>
          <RecentActivities />
        </Grid> */}
        {/* <Grid item xs={12} md={6}>
          <UpcomingEvents />
        </Grid> */}
      </Grid>
      <OverviewCards />

    </Container>
  );
};

export default AdminHomePage;
