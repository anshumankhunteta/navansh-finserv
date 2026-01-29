"use client";

import * as React from "react";
import { Container, Box, Typography, Grid, Stack } from "@mui/material";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ShieldIcon from "@mui/icons-material/Shield";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SecurityIcon from "@mui/icons-material/Security";
import Link from "next/link";

const trustLogos = [
  { name: "Partner 1", placeholder: "[INSERT LOGO 1]" },
  { name: "Partner 2", placeholder: "[INSERT LOGO 2]" },
  { name: "Partner 3", placeholder: "[INSERT LOGO 3]" },
  { name: "Partner 4", placeholder: "[INSERT LOGO 4]" },
  { name: "Partner 5", placeholder: "[INSERT LOGO 5]" },
];

const valueProps = [
  {
    icon: <ShieldIcon sx={{ fontSize: 48, color: "#f59e0b" }} />,
    title: "Expert Protection",
    description: "[INSERT POLICY DETAILS HERE] Comprehensive insurance solutions tailored to your needs.",
  },
  {
    icon: <TrendingUpIcon sx={{ fontSize: 48, color: "#f59e0b" }} />,
    title: "Wealth Building",
    description: "[INSERT INVESTMENT DETAILS HERE] Strategic mutual funds and SIP plans for long-term growth.",
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 48, color: "#f59e0b" }} />,
    title: "Asset Security",
    description: "[INSERT PROTECTION DETAILS HERE] Safeguard your hard-earned assets with proven strategies.",
  },
];

export default function Home() {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: "#0f172a",
          color: "#ffffff",
          py: { xs: 8, md: 16 },
          minHeight: { xs: "auto", md: "600px" },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.5rem", md: "3.75rem", lg: "4.5rem" },
                  fontWeight: 700,
                  mb: 3,
                  lineHeight: 1.2,
                }}
              >
                Protecting Futures with 15 Years of Experience
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1rem", md: "1.125rem" },
                  mb: 4,
                  color: "#cbd5e1",
                  lineHeight: 1.7,
                }}
              >
                [INSERT HERO DESCRIPTION HERE] Trusted financial services and insurance solutions
                designed to secure your family's future and build lasting wealth.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button variant="contained" component={Link} href="/contact">
                  Get Started
                </Button>
                <Button variant="outlined" sx={{ color: "#ffffff", borderColor: "#ffffff" }} component={Link} href="/services">
                  Learn More
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  width: "100%",
                  height: { xs: "300px", md: "400px", lg: "500px" },
                  backgroundColor: "#1e293b",
                  borderRadius: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#64748b",
                }}
              >
                <Typography variant="body1">[INSERT HERO IMAGE HERE]</Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Trust Signals */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: "#f8fafc" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              mb: 4,
              color: "#64748b",
              fontSize: { xs: "0.875rem", md: "1rem" },
              fontWeight: 500,
            }}
          >
            Trusted by Leading Partners
          </Typography>
          <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
            {trustLogos.map((logo, index) => (
              <Grid item xs={6} sm={4} md={2.4} key={index}>
                <Box
                  sx={{
                    height: { xs: "80px", md: "100px" },
                    backgroundColor: "#ffffff",
                    borderRadius: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #e5e7eb",
                    p: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: "0.75rem", md: "0.875rem" },
                      color: "#64748b",
                      textAlign: "center",
                    }}
                  >
                    {logo.placeholder}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Value Props */}
      <Box sx={{ py: { xs: 8, md: 16 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              textAlign: "center",
              fontSize: { xs: "2rem", md: "2.5rem", lg: "3rem" },
              fontWeight: 700,
              mb: 2,
              color: "#0f172a",
            }}
          >
            Why Choose Us
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              mb: { xs: 4, md: 8 },
              color: "#64748b",
              fontSize: { xs: "1rem", md: "1.125rem" },
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            [INSERT VALUE PROPOSITION TEXT HERE] We combine industry expertise with personalized
            service to deliver results that matter.
          </Typography>
          <Grid container spacing={{ xs: 4, md: 6 }}>
            {valueProps.map((prop, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card>
                  <Card.Content>
                    <Box sx={{ mb: 2 }}>{prop.icon}</Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontSize: { xs: "1.25rem", md: "1.5rem" },
                        fontWeight: 600,
                        mb: 2,
                        color: "#0f172a",
                      }}
                    >
                      {prop.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#64748b",
                        fontSize: { xs: "0.9375rem", md: "1rem" },
                        lineHeight: 1.7,
                      }}
                    >
                      {prop.description}
                    </Typography>
                  </Card.Content>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
