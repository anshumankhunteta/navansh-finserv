'use client';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Link from 'next/link';

export default function AboutContent() {
  return (
    <Box component="main" sx={{ minHeight: '100vh', bgcolor: 'background.paper' }}>
      {/* Hero / Intro */}
      <Box sx={{ bgcolor: 'primary.main', color: 'common.white', py: 12 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="overline" sx={{ color: 'secondary.main', fontWeight: 'bold', letterSpacing: 2 }}>
                About The Founder
              </Typography>
              <Typography variant="h2" component="h1" fontWeight="bold" sx={{ mt: 2, mb: 4 }}>
                15 Years of Experience. <br />
                <Box component="span" sx={{ color: 'secondary.main' }}>Unwavering Commitment.</Box>
              </Typography>
              <Typography variant="h6" sx={{ color: 'grey.300', mb: 4, lineHeight: 1.8 }}>
                &quot;I understand the weight of responsibility. As a mother and a veteran of the insurance industry, I don&apos;t just sell policies; I build safety nets.&quot;
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  width: '100%',
                  height: 400,
                  bgcolor: 'primary.dark',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed',
                  borderColor: 'primary.light'
                }}
              >
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  [INSERT FOUNDER IMAGE]
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* The Story */}
      <Container maxWidth="md" sx={{ py: 12 }}>
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom sx={{ color: 'primary.main' }}>
            Professional Stewardship
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.2rem', color: 'text.secondary', lineHeight: 1.8 }}>
            With over 15 years as a Sales Manager in the financial services sector, I have witnessed firsthand the transformative power of proper financial planning. My journey isn&apos;t just about numbers; it&apos;s about the people behind them.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.2rem', color: 'text.secondary', lineHeight: 1.8 }}>
            Navigating the complexities of life and health insurance requires more than just industry knowledge—it requires empathy and a deep understanding of what it means to protect a family.
          </Typography>
        </Box>

        <Box sx={{ p: 6, bgcolor: 'secondary.light', borderRadius: 4, color: 'secondary.contrastText' }}>
          <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
            Resiliance & Dedication
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', mb: 4 }}>
            Raising a family as a single mom taught me the importance of having a plan B, C, and D. That personal resilience translates directly into how I serve my clients. I approach every consultation with the same care and diligence I would want for my own family.
          </Typography>
          <Button variant="contained" color="primary" size="large" component={Link} href="/contact">
            Work With Me
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
