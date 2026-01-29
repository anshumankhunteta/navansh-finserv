"use client";

import * as React from "react";
import { Container, Box, Typography, Grid, Stack, Alert } from "@mui/material";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message is too long"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // Prevent XSS by ensuring data is properly sanitized (Zod validation helps)
    // In production, this would send to a secure API endpoint
    console.log("Form submitted:", data);

    // [INSERT FORM SUBMISSION LOGIC HERE]
    // For now, we'll just show a success message
    alert("Thank you for your message! We'll get back to you soon.");
    reset();
  };

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
            Get in Touch
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
            [INSERT CONTACT INTRODUCTION HERE] Ready to secure your financial
            future? Schedule a consultation or send us a message.
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 4, md: 8 }}>
          {/* Contact Form */}
          <Grid item xs={12} md={6}>
            <Card>
              <Card.Content>
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: { xs: "1.75rem", md: "2.25rem" },
                    fontWeight: 700,
                    mb: 2,
                    color: "#0f172a",
                  }}
                >
                  Send Us a Message
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: "0.9375rem", md: "1rem" },
                    color: "#64748b",
                    mb: 4,
                    lineHeight: 1.7,
                  }}
                >
                  Have questions? Fill out the form below and we'll get back to
                  you as soon as possible.
                </Typography>

                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                  <Stack spacing={3}>
                    <Input
                      label="Name"
                      fullWidth
                      {...register("name")}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      required
                    />

                    <Input
                      label="Email"
                      type="email"
                      fullWidth
                      {...register("email")}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      required
                    />

                    <Textarea
                      label="How can we help?"
                      fullWidth
                      {...register("message")}
                      error={!!errors.message}
                      helperText={errors.message?.message}
                      required
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={isSubmitting}
                      sx={{ mt: 2 }}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </Stack>
                </Box>
              </Card.Content>
            </Card>
          </Grid>
        </Grid>

        {/* Calendar Embed */}
        <Grid item xs={12} md={6}>
          <Card>
            <Card.Content>
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: "1.75rem", md: "2.25rem" },
                  fontWeight: 700,
                  mb: 2,
                  color: "#0f172a",
                }}
              >
                Schedule a Consultation
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "0.9375rem", md: "1rem" },
                  color: "#64748b",
                  mb: 3,
                  lineHeight: 1.7,
                }}
              >
                [INSERT CALENDAR DESCRIPTION HERE] Book a time that works for
                you. We'll discuss your financial goals and create a
                personalized plan.
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  height: { xs: "600px", md: "700px" },
                  backgroundColor: "#f8fafc",
                  borderRadius: "0.5rem",
                  border: "1px solid #e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <Box
                  component="iframe"
                  src="[INSERT CALENDLY/CAL.COM EMBED URL HERE]"
                  sx={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                  }}
                  title="Schedule Consultation"
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    textAlign: "center",
                    p: 2,
                  }}
                >
                  [INSERT CALENDLY/CAL.COM EMBED HERE]
                  <br />
                  Replace this placeholder with your actual calendar embed code
                </Typography>
              </Box>
            </Card.Content>
          </Card>
        </Grid>
      </Container>
    </Box>
  );
}
