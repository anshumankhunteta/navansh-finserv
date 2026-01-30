'use client';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import ShieldIcon from '@mui/icons-material/Shield';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Link from 'next/link';

export default function HomeContent() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <div className="w-full bg-slate-900 text-white py-20 px-6">
        <Container maxWidth="lg">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left space-y-6">
              <Typography variant="h2" component="h1" className="font-bold text-4xl md:text-6xl leading-tight">
                Protecting Futures with <span className="text-amber-500">15 Years</span> of Experience.
              </Typography>
              <Typography variant="h6" className="text-slate-300 text-lg md:text-xl max-w-2xl">
                We don&apos;t just sell policies; we build safety nets. Expert guidance for Life, Health, and Wealth creation.
              </Typography>
              <div className="flex gap-4 justify-center md:justify-start pt-4">
                <Button 
                  variant="contained" 
                  color="secondary" 
                  size="large" 
                  component={Link} 
                  href="/contact"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-8 py-3"
                >
                  Get a Free Consultation
                </Button>
                <Button 
                  variant="outlined" 
                  size="large" 
                  component={Link} 
                  href="/services"
                  className="text-white border-white hover:border-amber-500 hover:text-amber-500 px-8 py-3"
                >
                  Our Services
                </Button>
              </div>
            </div>
            {/* Image Placeholder */}
            <div className="flex-1 order-first md:order-last w-full max-w-lg">
               <div className="aspect-square bg-slate-800 rounded-2xl flex items-center justify-center border-2 border-slate-700 relative overflow-hidden">
                  <Typography variant="body1" className="text-slate-500">
                    [INSERT HERO IMAGE]
                  </Typography>
                  {/* Decorative Elements */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl"></div>
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>
               </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Trust Signals */}
      <div className="w-full bg-white py-12 border-b border-slate-100">
        <Container maxWidth="lg">
          <Typography variant="subtitle1" align="center" className="text-slate-500 mb-8 uppercase tracking-widest text-sm font-semibold">
            Trusted By Leading Providers
          </Typography>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center opacity-60">
             {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-slate-200 rounded animate-pulse flex items-center justify-center">
                   <span className="text-xs text-slate-400">LOGO {i}</span>
                </div>
             ))}
          </div>
        </Container>
      </div>

      {/* Value Props */}
      <div className="w-full bg-slate-50 py-24 px-6 opacity-0 animate-[fadeIn_1s_ease-out_forwards]" style={{ animationDelay: '0.2s' }}>
        <Container maxWidth="lg">
           <Typography variant="h3" component="h2" align="center" className="text-slate-900 font-bold mb-16">
             Why Choose Us?
           </Typography>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <Card className="p-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="flex flex-col items-center text-center space-y-4 py-8">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                    <FamilyRestroomIcon fontSize="large" />
                  </div>
                  <Typography variant="h5" component="h3" fontWeight="bold">
                    Family First
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Securing your family&apos;s foundation with comprehensive life and health coverage tailored to your needs.
                  </Typography>
                </CardContent>
              </Card>

              {/* Card 2 */}
              <Card className="p-2 shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-amber-500">
                <CardContent className="flex flex-col items-center text-center space-y-4 py-8">
                  <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                     <TrendingUpIcon fontSize="large" />
                  </div>
                  <Typography variant="h5" component="h3" fontWeight="bold">
                    Wealth Building
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Expert mutual fund and SIP strategies to help you build actual wealth over time.
                  </Typography>
                </CardContent>
              </Card>

              {/* Card 3 */}
              <Card className="p-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="flex flex-col items-center text-center space-y-4 py-8">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                     <ShieldIcon fontSize="large" />
                  </div>
                  <Typography variant="h5" component="h3" fontWeight="bold">
                    Asset Protection
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Safeguarding what you&apos;ve built with robust asset protection solutions.
                  </Typography>
                </CardContent>
              </Card>
           </div>
        </Container>
      </div>
    </main>
  );
}
