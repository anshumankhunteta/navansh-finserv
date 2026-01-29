"use client";

import * as React from "react";
import { Container, Box, Typography, Grid, Stack } from "@mui/material";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LockIcon from "@mui/icons-material/Lock";
import Link from "next/link";

const services = [
  {
    icon: <HealthAndSafetyIcon sx={{ fontSize: 64, color: "#f59e0b" }} />,
    title: "Life & Health Insurance",
    description: "Securing your family's foundation",
    details: "[INSERT LIFE & HEALTH INSURANCE DETAILS HERE] Comprehensive coverage options including term life, whole life, health insurance, and critical illness protection. We help you choose the right plan to protect your loved ones.",
    features: [
      "[INSERT FEATURE 1 HERE]",
      "[INSERT FEATURE 2 HERE]",
      "[INSERT FEATURE 3 HERE]",
    ],
  },
  {
    icon: <AccountBalanceIcon sx={{ fontSize: 64, color: "#f59e0b" }} />,
    title: "Mutual Funds and SIP",
    description: "Building Actual Wealth",
    details: "[INSERT MUTUAL FUNDS & SIP DETAILS HERE] Strategic investment solutions through systematic investment plans (SIP) and mutual fund portfolios. Build wealth systematically with expert guidance and proven strategies.",
    features: [
      "[INSERT FEATURE 1 HERE]",
      "[INSERT FEATURE 2 HERE]",
      "[INSERT FEATURE 3 HERE]",
    ],
  },
  {
    icon: <LockIcon sx={{ fontSize: 64, color: "#f59e0b" }} />,
    title: "Asset Protection",
    description: "Safeguarding what you've built",
    details: "[INSERT ASSET PROTECTION DETAILS HERE] Comprehensive asset protection strategies to shield your wealth from risks. From estate planning to insurance coverage, we help you protect what matters most.",
    features: [
      "[INSERT FEATURE 1 HERE]",
      "[INSERT FEATURE 2 HERE]",
      "[INSERT FEATURE 3 HERE]",
    ],
  },
];

export default function Services() {
  return (
    <Box sx={{ py: { xs: 6, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 10 } }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
              fontWeight: 700,
              mb: 3,
              color: "#0f172a",
            }}
          >
            Our Services
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "1rem", md: "1.125rem" },
              color: "#64748b",
              maxWidth: "700px",
              mx: "auto",
              lineHeight: 1.7,
            }}
          >
            [INSERT SERVICES INTRODUCTION HERE] We don't just sell policies—we build comprehensive
            financial safety nets tailored to your unique needs and goals.
          </Typography>
        </Box>

        <Stack spacing={{ xs: 6, md: 10 }}>
          {services.map((service, index) => (
            <Card key={index}>
              <Card.Content>
                <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: { xs: "center", md: "flex-start" },
                        mb: { xs: 2, md: 0 },
                      }}
                    >
                      {service.icon}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontSize: { xs: "1.75rem", md: "2.25rem" },
                        fontWeight: 700,
                        mb: 1,
                        color: "#0f172a",
                      }}
                    >
                      {service.title}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: { xs: "1rem", md: "1.125rem" },
                        fontWeight: 500,
                        mb: 3,
                        color: "#f59e0b",
                      }}
                    >
                      {service.description}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: { xs: "0.9375rem", md: "1rem" },
                        color: "#475569",
                        mb: 3,
                        lineHeight: 1.8,
                      }}
                    >
                      {service.details}
                    </Typography>
                    <Box component="ul" sx={{ pl: 3, mb: 3 }}>
                      {service.features.map((feature, idx) => (
                        <Typography
                          key={idx}
                          component="li"
                          variant="body1"
                          sx={{
                            fontSize: { xs: "0.9375rem", md: "1rem" },
                            color: "#64748b",
                            mb: 1,
                            lineHeight: 1.7,
                          }}
                        >
                          {feature}
                        </Typography>
                      ))}
                    </Box>
                    <Button variant="contained" component={Link} href="/contact">
                      Learn More
                    </Button>
                  </Grid>
                </Grid>
              </Card.Content>
            </Card>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
