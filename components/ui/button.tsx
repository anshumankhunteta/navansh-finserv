"use client";

import * as React from "react";
import { Button as MuiButton, ButtonProps as MuiButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledButton = styled(MuiButton)(({ theme }) => ({
  minHeight: "44px",
  padding: "0.75rem 1.5rem",
  fontSize: "1rem",
  fontWeight: 600,
  textTransform: "none",
  borderRadius: "0.5rem",
  "&.MuiButton-contained": {
    backgroundColor: "#f59e0b",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#d97706",
    },
  },
  "&.MuiButton-outlined": {
    borderColor: "#f59e0b",
    color: "#f59e0b",
    "&:hover": {
      borderColor: "#d97706",
      backgroundColor: "rgba(245, 158, 11, 0.1)",
    },
  },
  [theme.breakpoints.down("md")]: {
    minHeight: "44px",
    padding: "0.625rem 1.25rem",
    fontSize: "0.9375rem",
  },
}));

export interface ButtonProps extends Omit<MuiButtonProps, "variant"> {
  variant?: "contained" | "outlined" | "text";
}

export function Button({ children, ...props }: ButtonProps) {
  return <StyledButton {...props}>{children}</StyledButton>;
}
