'use client';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from 'next/link';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SecurityIcon from '@mui/icons-material/Security';

const services = [
  {
    title: 'Life & Health Insurance',
    description: "Securing your family's foundation. We ensure that your loved ones are protected against life's uncertainties with comprehensive coverage options.",
    icon: <HealthAndSafetyIcon fontSize="large" />,
  },
  {
    title: 'Mutual Funds and SIP',
    description: 'Building Actual Wealth. Expert guidance on Systematic Investment Plans and mutual funds to help you achieve your long-term financial goals.',
    icon: <AccountBalanceIcon fontSize="large" />,
  },
  {
    title: 'Asset Protection',
    description: "Safeguarding what you've built. Advanced strategies to protect your hard-earned assets from unforeseen risks and liabilities.",
    icon: <SecurityIcon fontSize="large" />,
  },
];

export default function ServicesContent() {
  return (
    <main className="min-h-screen bg-slate-50 py-16">
      <Container maxWidth="lg">
        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
            Our Services
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
            Comprehensive financial solutions tailored to your unique journey. 
            From protection to wealth creation, we are with you every step of the way.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  },
                  p: { xs: 2, md: 0 } // Extra padding on mobile
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 6 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mb: 3, 
                    color: 'secondary.main' 
                  }}>
                    {service.icon}
                  </Box>
                  <Typography gutterBottom variant="h5" component="h2" fontWeight="bold">
                    {service.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 2, lineHeight: 1.7 }}>
                    {service.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 4 }}>
                  <Button 
                    size="large" 
                    variant="outlined" 
                    component={Link} 
                    href="/contact"
                    className="min-h-[44px]" // Ensure large touch target
                  >
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </main>
  );
}
