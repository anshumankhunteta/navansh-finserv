import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Contact Us - Navansh Finserv',
  description: 'Get in touch with Navansh Finserv. Schedule a consultation or send us a message to discuss your financial planning needs.',
};
export default function ContactPage() {
  return (
    <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" component="h1" align="center" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 8 }}>
          Get In Touch
        </Typography>
        <Grid container spacing={6}>

          {/* Tally.so Form Embed Section */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper elevation={3} sx={{ p: 4, height: '100%', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                Send a Message
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Have a quick question? Fill out the form below and we&apos;ll be in touch.
              </Typography>
              {/* Tally.so Embed */}
              <Box
                sx={{
                  flexGrow: 1,
                  borderRadius: 2,
                  overflow: 'hidden',
                  mt: 2,
                  minHeight: '690px',
                }}
              >
                <iframe
                  src="https://tally.so/embed/zxYKoa?alignLeft=1&hideTitle=1&transparentBackground=1"
                  width="100%"
                  height="100%"
                  title="Contact Form - Navansh Finserv"
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    minHeight: '450px',
                    border: 'none',
                  }}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Calendar Section - Primary */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper elevation={3} sx={{ p: 4, height: '100%', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                Schedule a Consultation
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Book a time that works for you. Let&apos;s discuss how we can protect your future.
              </Typography>
              {/* Calendly Placeholder */}
              <Box
                sx={{
                  flexGrow: 1,
                  bgcolor: 'grey.100',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px dashed',
                  borderColor: 'grey.300',
                  mt: 2
                }}
              >
                <Typography variant="body1" color="text.secondary" align="center">
                  [CALENDLY EMBED CODE HERE] <br />
                  <Box component="span" sx={{ fontSize: '0.875rem' }}>(Responsive Iframe)</Box>
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}