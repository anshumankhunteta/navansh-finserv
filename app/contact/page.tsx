'use client';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ContactForm from '@/components/ui/ContactForm';
import Paper from '@mui/material/Paper';
import Link from 'next/link';
import { IconButton, Tooltip } from '@mui/material';
import ForwardToInboxIcon from '@mui/icons-material/ForwardToInbox';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

export default function ContactPage() {
  return (
    <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 8 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" component="h1" align="center" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 8 }}>
          Get In Touch
        </Typography>

        <Grid container spacing={6}>
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

          {/* Contact Form Section - Secondary */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                  Send a Message
                </Typography>
                <Box>
                  <Tooltip title="Prefer to email directly?">
                    <IconButton color='grey' href="mailto:mileekhunteta@gmail.com">
                      <ForwardToInboxIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Message us on WhatsApp">
                    <IconButton color='success'>
                      <WhatsAppIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Typography variant="body1" color="text.secondary" paragraph>
                Have a quick question? Fill out the form below and we&apos;ll be in touch.
              </Typography>
              <ContactForm />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
