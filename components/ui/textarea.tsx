"use client";

import * as React from "react";
import { TextField, TextFieldProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    minHeight: "120px",
    borderRadius: "0.5rem",
    "& fieldset": {
      borderColor: "#e5e7eb",
    },
    "&:hover fieldset": {
      borderColor: "#d1d5db",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#f59e0b",
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.9375rem",
    "&.Mui-focused": {
      color: "#f59e0b",
    },
  },
  [theme.breakpoints.down("md")]: {
    "& .MuiOutlinedInput-root": {
      minHeight: "120px",
      fontSize: "1rem",
    },
  },
}));

export interface TextareaProps extends Omit<TextFieldProps, "variant" | "multiline"> {
  variant?: "outlined" | "filled" | "standard";
}

export function Textarea({ ...props }: TextareaProps) {
  return <StyledTextField variant="outlined" multiline rows={4} {...props} />;
}
