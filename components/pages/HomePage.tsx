'use client';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import ShieldIcon from '@mui/icons-material/Shield';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Link from 'next/link';

export default function HomeContent() {
  return (
    <Box component="main" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box sx={{ width: '100%', bgcolor: 'primary.main', color: 'common.white', py: 10, px: 3 }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={6} alignItems="center">
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h2" component="h1" sx={{ fontWeight: 800, mb: 3, lineHeight: 1.2 }}>
                Protecting Futures with <Box component="span" sx={{ color: 'secondary.main' }}>15 Years</Box> of Experience.
              </Typography>
              <Typography variant="h6" sx={{ color: 'grey.300', mb: 4, maxWidth: 'sm', mx: { xs: 'auto', md: 0 } }}>
                We don&apos;t just sell policies, we build safety nets. Expert guidance for Life, Health, and Wealth creation.
              </Typography>
              <Stack direction="row" spacing={2} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  component={Link}
                  href="/contact"
                >
                  Get a Free Consultation
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  href="/services"
                  sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'secondary.main', color: 'secondary.main' } }}
                >
                  What We Do
                </Button>
              </Stack>
            </Box>
            {/* Image Placeholder */}
            <Box sx={{ flex: 1, width: '100%', maxWidth: 'sm', order: { xs: -1, md: 1 } }}>
              <Box sx={{
                aspectRatio: '1',
                bgcolor: 'primary.dark',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 2,
                borderColor: 'primary.light',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  [INSERT HERO IMAGE]
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Trust Signals */}
      <Box sx={{ width: '100%', bgcolor: 'background.paper', py: 6, borderBottom: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Typography variant="subtitle2" align="center" sx={{ color: 'text.secondary', mb: 4, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 600 }}>
            Trusted By Leading Providers
          </Typography>
          <Grid container spacing={4} justifyContent="center" alignItems="center" sx={{ opacity: 0.6 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Grid size={{ xs: 6, md: 2.4 }} key={i}>
                <Box sx={{ height: 48, bgcolor: 'grey.100', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="caption" color="text.disabled">LOGO {i}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Value Props */}
      <Box sx={{ width: '100%', bgcolor: 'background.default', py: 12, px: 3 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" sx={{ color: 'text.primary', fontWeight: 700, mb: 8 }}>
            Why Choose Us?
          </Typography>

          <Grid container spacing={4}>
            {/* Card 1 */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Box sx={{ width: 64, height: 64, bgcolor: 'primary.light', color: 'primary.contrastText', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                    <FamilyRestroomIcon fontSize="large" />
                  </Box>
                  <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                    Family First
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Securing your family&apos;s foundation with comprehensive life and health coverage tailored to your needs.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Card 2 */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2, borderTop: 4, borderColor: 'secondary.main' }}>
                <CardContent>
                  <Box sx={{ width: 64, height: 64, bgcolor: 'secondary.light', color: 'secondary.contrastText', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                    <TrendingUpIcon fontSize="large" />
                  </Box>
                  <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                    Wealth Building
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Expert mutual fund and SIP strategies to help you build actual wealth over time.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Card 3 */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Box sx={{ width: 64, height: 64, bgcolor: 'success.light', color: 'success.contrastText', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                    <ShieldIcon fontSize="large" />
                  </Box>
                  <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                    Asset Protection
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Safeguarding what you&apos;ve built with robust asset protection solutions.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
