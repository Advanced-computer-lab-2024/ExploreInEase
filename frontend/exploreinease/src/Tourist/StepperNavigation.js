import React from "react";
import { Box, Typography } from "@mui/material";

const StepperNavigation = ({ activeStep }) => {
  const steps = ["Cart", "Checkout", "Payment"];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "20px",
      }}
    >
      {steps.map((step, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Step Circle */}
          <Box
            sx={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              border: "2px solid",
              borderColor: index === activeStep ? "#072F5F" : "#d3d3d3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "8px",
            }}
          >
            <Typography
              sx={{
                fontSize: "12px",
                color: index === activeStep ? "#072F5F" : "#d3d3d3",
              }}
            >
              {index + 1}
            </Typography>
          </Box>

          {/* Step Label */}
          <Typography
            sx={{
              fontWeight: index === activeStep ? "bold" : "normal",
              color: index === activeStep ? "#072F5F" : "#d3d3d3",
              marginRight: "8px",
            }}
          >
            {step}
          </Typography>

          {/* Arrow Separator */}
          {index < steps.length - 1 && (
            <Typography
              sx={{
                color: "#d3d3d3",
                marginRight: "8px",
              }}
            >
              &gt;
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default StepperNavigation;
