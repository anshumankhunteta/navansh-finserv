"use client";

import * as React from "react";
import { Container, Box, Typography, Grid, Stack } from "@mui/material";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Link from "next/link";

export default function About() {
  return (
    <Box sx={{ py: { xs: 6, md: 12 } }}>
      <Container maxWidth="lg">
        {/* Founder Bio Section */}
        <Box sx={{ mb: { xs: 8, md: 12 } }}>
          <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
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
                <Typography variant="body1">[INSERT FOUNDER PHOTO HERE]</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2rem", md: "2.75rem", lg: "3.5rem" },
                  fontWeight: 700,
                  mb: 3,
                  color: "#0f172a",
                }}
              >
                Meet the Founder
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1rem", md: "1.125rem" },
                  color: "#475569",
                  mb: 3,
                  lineHeight: 1.8,
                }}
              >
                With 15 years of experience as a sales manager in the insurance industry, I bring a
                unique combination of professional expertise and personal understanding to every
                client relationship.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1rem", md: "1.125rem" },
                  color: "#475569",
                  mb: 4,
                  lineHeight: 1.8,
                }}
              >
                [INSERT FOUNDER BIO DETAILS HERE] My journey has taught me that financial security
                isn't just about policies and premiums—it's about peace of mind, family protection,
                and building a legacy that lasts.
              </Typography>
              <Button variant="contained" component={Link} href="/contact">
                Schedule a Consultation
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* The "Why" Section */}
        <Box sx={{ mb: { xs: 8, md: 12 } }}>
          <Card>
            <Card.Content>
              <Box sx={{ textAlign: "center", mb: 6 }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: "2rem", md: "2.5rem", lg: "3rem" },
                    fontWeight: 700,
                    mb: 3,
                    color: "#0f172a",
                  }}
                >
                  The "Why"
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: "1rem", md: "1.125rem" },
                    color: "#475569",
                    maxWidth: "800px",
                    mx: "auto",
                    lineHeight: 1.8,
                    mb: 4,
                  }}
                >
                  I understand the weight of responsibility. As a mother and a veteran of the
                  insurance industry, I don't just sell policies; I build safety nets.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: "1rem", md: "1.125rem" },
                    color: "#475569",
                    maxWidth: "800px",
                    mx: "auto",
                    lineHeight: 1.8,
                  }}
                >
                  [INSERT ADDITIONAL "WHY" CONTENT HERE] This personal understanding of resilience
                  and professional stewardship drives everything we do. Every recommendation is made
                  with the same care I would give my own family.
                </Typography>
              </Box>
            </Card.Content>
          </Card>
        </Box>

        {/* Values Grid */}
        <Grid container spacing={{ xs: 4, md: 6 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <Card.Content>
                <Box sx={{ mb: 2 }}>
                  <PersonIcon sx={{ fontSize: 48, color: "#f59e0b" }} />
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: "1.25rem", md: "1.5rem" },
                    fontWeight: 600,
                    mb: 2,
                    color: "#0f172a",
                  }}
                >
                  15 Years Experience
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#64748b",
                    fontSize: { xs: "0.9375rem", md: "1rem" },
                    lineHeight: 1.7,
                  }}
                >
                  [INSERT EXPERIENCE DETAILS HERE] Over a decade and a half of navigating the
                  insurance landscape, understanding market trends, and helping clients make informed
                  decisions.
                </Typography>
              </Card.Content>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <Card.Content>
                <Box sx={{ mb: 2 }}>
                  <BusinessIcon sx={{ fontSize: 48, color: "#f59e0b" }} />
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: "1.25rem", md: "1.5rem" },
                    fontWeight: 600,
                    mb: 2,
                    color: "#0f172a",
                  }}
                >
                  Sales Manager Background
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#64748b",
                    fontSize: { xs: "0.9375rem", md: "1rem" },
                    lineHeight: 1.7,
                  }}
                >
                  [INSERT SALES EXPERTISE DETAILS HERE] Proven track record in sales management,
                  team leadership, and client relationship building across the insurance industry.
                </Typography>
              </Card.Content>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <Card.Content>
                <Box sx={{ mb: 2 }}>
                  <FavoriteIcon sx={{ fontSize: 48, color: "#f59e0b" }} />
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: "1.25rem", md: "1.5rem" },
                    fontWeight: 600,
                    mb: 2,
                    color: "#0f172a",
                  }}
                >
                  Personal Understanding
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#64748b",
                    fontSize: { xs: "0.9375rem", md: "1rem" },
                    lineHeight: 1.7,
                  }}
                >
                  [INSERT PERSONAL TOUCH DETAILS HERE] A deep understanding of what families need
                  because I've walked the same path. Every recommendation comes from both
                  professional expertise and personal experience.
                </Typography>
              </Card.Content>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
