import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ContactForm from '@/components/ui/ContactForm';
import Paper from '@mui/material/Paper';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16">
      <Container maxWidth="lg">
        <Typography variant="h2" component="h1" align="center" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 8 }}>
          Get In Touch
        </Typography>

        <Grid container spacing={8}>
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
                  [CALENDLY EMBED CODE HERE] <br/>
                  <span className="text-sm">(Responsive Iframe)</span>
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Contact Form Section - Secondary */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                Send a Message
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Have a quick question? Fill out the form below and we&apos;ll be in touch.
              </Typography>
              <ContactForm />
            </Paper>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
               <Typography variant="body2" color="text.secondary">
                 Prefer to email directly? <br/>
                 <a href="mailto:contact@insurancefirm.com" className="text-amber-600 font-semibold hover:underline">
                   contact@insurancefirm.com
                 </a>
               </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}
