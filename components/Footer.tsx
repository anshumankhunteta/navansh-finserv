'use client';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from 'next/link';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h6" align="center" gutterBottom color="primary">
          Insurance Firm
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" paragraph>
          Protecting Futures with 15 Years of Experience.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, my: 3, flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center' }}>
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
          <Link href="/services" style={{ textDecoration: 'none', color: 'inherit' }}>Services</Link>
          <Link href="/about" style={{ textDecoration: 'none', color: 'inherit' }}>About</Link>
          <Link href="/contact" style={{ textDecoration: 'none', color: 'inherit' }}>Contact</Link>
        </Box>
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
