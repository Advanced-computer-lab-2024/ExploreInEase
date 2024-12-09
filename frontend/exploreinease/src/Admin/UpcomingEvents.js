import { Card, CardContent, Typography } from '@mui/material';

const UpcomingEvents = () => {
  const events = [
    { title: "Summer Festival", date: "2024-12-01" },
    { title: "Annual Meeting", date: "2024-12-15" },
    { title: "Product Launch", date: "2024-12-20" },
  ];

  return (
    <div>
      {events.map((event, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{event.title}</Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {event.date}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UpcomingEvents;
