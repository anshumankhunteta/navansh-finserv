'use client';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from 'next/link';
import Stack from '@mui/material/Stack';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h6" align="center" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
          Insurance Firm
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" paragraph>
          Protecting Futures with 15 Years of Experience.
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          justifyContent="center"
          alignItems="center"
          sx={{ my: 3 }}
        >
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
          <Link href="/services" style={{ textDecoration: 'none', color: 'inherit' }}>Services</Link>
          <Link href="/about" style={{ textDecoration: 'none', color: 'inherit' }}>About</Link>
          <Link href="/contact" style={{ textDecoration: 'none', color: 'inherit' }}>Contact</Link>
        </Stack>

        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4, opacity: 0.7 }}>
          Disclaimer: This website provides general information and does not constitute financial advice.
          Specific policies depend on individual circumstances. [INSERT LICENSE NUMBER HERE]
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          {'Copyright © '}
          {new Date().getFullYear()}
          {' Insurance Firm. All rights reserved.'}
        </Typography>
      </Container>
    </Box>
  );
}
