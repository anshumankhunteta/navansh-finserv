"use client";

import * as React from "react";
import { Box, Container, Typography, Link, Stack, Divider } from "@mui/material";
import LinkNext from "next/link";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#0f172a",
        color: "#ffffff",
        py: { xs: 4, md: 6 },
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 4, md: 8 }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 2, fontSize: { xs: "1.125rem", md: "1.25rem" } }}
            >
              Navansh Finserv
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#94a3b8", fontSize: { xs: "0.875rem", md: "0.9375rem" } }}
            >
              Protecting Futures with 15 Years of Experience
            </Typography>
          </Box>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 2, md: 4 }}
            sx={{ minHeight: { xs: "auto", md: "44px" } }}
          >
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                component={LinkNext}
                href={link.href}
                sx={{
                  color: "#ffffff",
                  textDecoration: "none",
                  fontSize: { xs: "0.875rem", md: "0.9375rem" },
                  "&:hover": {
                    color: "#f59e0b",
                  },
                  minHeight: "44px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {link.label}
              </Link>
            ))}
          </Stack>
        </Stack>
        <Divider sx={{ my: 4, borderColor: "rgba(255, 255, 255, 0.1)" }} />
        <Box>
          <Typography
            variant="body2"
            sx={{
              color: "#94a3b8",
              fontSize: { xs: "0.75rem", md: "0.875rem" },
              lineHeight: 1.6,
            }}
          >
            <strong>Disclaimer:</strong> [INSERT DISCLAIMER TEXT HERE] This website is for
            informational purposes only. Insurance products and financial services are subject to
            terms and conditions. Please consult with a licensed financial advisor before making any
            investment decisions. Past performance is not indicative of future results. All
            insurance policies are subject to underwriting approval.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              mt: 2,
              fontSize: { xs: "0.75rem", md: "0.875rem" },
            }}
          >
            © {new Date().getFullYear()} Navansh Financial Services. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
