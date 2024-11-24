import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Agent = () => {
  const [showAccordions, setShowAccordions] = useState(false);
  const [csvData, setCsvData] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Parse CSV data
      const csvText = reader.result;
      const parsedData = csvText.split("\n").map((row) => row.split(","));
      setCsvData(parsedData);

      // Show accordions after 1 second
      setTimeout(() => {
        setShowAccordions(true);
      }, 1000);
    };
    reader.readAsText(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
  });

  // Calculate theme averages
  const themeAverages = {
    "Empowerment/Personal Choice": 2.37,
    Convenience: 2.44,
    "Non-Estrogen Formula": 2.85,
    "Safety & Effectiveness": 2.9,
  };

  return (
    <Box sx={{ padding: 3 }}>
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #ccc",
          padding: "40px",
          textAlign: "center",
          marginBottom: "40px",
          backgroundColor: isDragActive ? "#f0f0f0" : "white",
        }}
      >
        <input {...getInputProps()} />
        <p>
          {isDragActive
            ? "Drop the CSV file here"
            : "Drag and drop a CSV file here, or click to select one"}
        </p>
      </div>

      {csvData.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{
            // px: 10, // padding
            ml: 12.5, // margin left
            pr: 12.5, // margin right
            width: "80%",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                {csvData[0]?.map((header, index) => (
                  <TableCell key={index} align="center">
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {csvData.slice(1).map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex} align="center">
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {showAccordions && (
        <Box sx={{ marginTop: 3 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Finding Common Caption Themes</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Analysis of common themes in captions...</Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Categorizing Common Themes</Typography>
            </AccordionSummary>
            <AccordionDetails>{/* Display themes.csv data */}</AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Grouped Themes by CTR</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {Object.entries(themeAverages).map(([theme, ctr]) => (
                <Typography key={theme}>
                  {theme}: {ctr.toFixed(2)}
                </Typography>
              ))}
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Box>
  );
};

export default Agent;
