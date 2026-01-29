"use client";

import * as React from "react";
import { Card as MuiCard, CardContent, CardActions } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledCard = styled(MuiCard)(({ theme }) => ({
  borderRadius: "0.75rem",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transform: "translateY(-4px)",
  },
  [theme.breakpoints.down("md")]: {
    borderRadius: "0.5rem",
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: "1.5rem",
  "&:last-child": {
    paddingBottom: "1.5rem",
  },
  [theme.breakpoints.down("md")]: {
    padding: "1.25rem",
    "&:last-child": {
      paddingBottom: "1.25rem",
    },
  },
}));

const StyledCardActions = styled(CardActions)(({ theme }) => ({
  padding: "0 1.5rem 1.5rem",
  [theme.breakpoints.down("md")]: {
    padding: "0 1.25rem 1.25rem",
  },
}));

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return <StyledCard className={className}>{children}</StyledCard>;
}

Card.Content = StyledCardContent;
Card.Actions = StyledCardActions;
