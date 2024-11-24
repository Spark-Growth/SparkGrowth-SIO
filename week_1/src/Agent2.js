import React, { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Agent2 = () => {
  const [csvData, setCsvData] = useState([]);
  const [themesData, setThemesData] = useState([]);
  const [showAccordions, setShowAccordions] = useState(false);
  const [groupedThemes, setGroupedThemes] = useState([]);
  const [showFirstAccordion, setShowFirstAccordion] = useState(false);
  const [showSecondAccordion, setShowSecondAccordion] = useState(false);
  const [showThirdAccordion, setShowThirdAccordion] = useState(false);

  useEffect(() => {
    // Parse themes.csv from public folder
    const parseThemesData = async () => {
      try {
        const response = await fetch("/themes.csv"); // Access from public folder
        console.log("Themes response:", response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        console.log("Raw themes text:", text);

        const rows = text.split("\n").map((row) => {
          console.log("Processing row:", row);
          const matches = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
          console.log("Matches:", matches);
          if (matches) {
            return matches.map((value) => value.replace(/^"|"$/g, "").trim());
          }
          return [];
        });

        console.log("Final parsed themes:", rows);
        setThemesData(rows);
      } catch (error) {
        console.error("Error loading themes:", error);
        console.error("Error details:", {
          message: error.message,
          stack: error.stack,
        });
      }
    };

    parseThemesData();
  }, []);

  const calculateAverageByTheme = (data) => {
    // Skip header row
    const rows = data.slice(1);
    const themeGroups = {};

    // Group CTRs by theme
    rows.forEach((row) => {
      const ctr = parseFloat(row[1]); // CTR is in column 1
      const theme = row[4]; // Theme is in column 4
      if (!themeGroups[theme]) {
        themeGroups[theme] = [];
      }
      themeGroups[theme].push(ctr);
    });

    // Calculate averages
    const averages = Object.entries(themeGroups).map(([theme, ctrs]) => ({
      theme,
      averageCTR: (ctrs.reduce((a, b) => a + b, 0) / ctrs.length).toFixed(2),
    }));

    setGroupedThemes(averages);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "text/csv": [".csv"],
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      console.log("Reading file:", file.name);

      const reader = new FileReader();

      reader.onload = (e) => {
        const text = e.target?.result;
        console.log("Raw CSV text:", text);

        // Parse CSV while respecting quoted fields
        const rows = text.split("\n").map((row) => {
          console.log("Processing row:", row);
          const matches = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
          console.log("Matches found:", matches);
          if (matches) {
            const processedRow = matches.map((value) =>
              value.replace(/^"|"$/g, "").trim()
            );
            console.log("Processed row:", processedRow);
            return processedRow;
          }
          return [];
        });

        console.log("Final parsed data:", rows);
        setCsvData(rows);
        calculateAverageByTheme(rows); // Calculate theme averages

        // Staggered appearance of accordions
        setTimeout(() => {
          setShowFirstAccordion(true);
        }, 1000);

        setTimeout(() => {
          setShowSecondAccordion(true);
        }, 4000);

        setTimeout(() => {
          setShowThirdAccordion(true);
        }, 7000);
      };

      reader.readAsText(file);
    },
  });

  return (
    <Box sx={{ maxWidth: "4xl", mx: "auto", p: 4, "& > *": { mb: 4 } }}>
      <Typography variant="h4" align="center" sx={{ mb: 3 }}>
        SIO Analysis Tool
      </Typography>

      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #ccc",
          borderRadius: "8px",
          padding: "32px",
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: isDragActive ? "#f0f0f0" : "white",
          transition: "background-color 0.2s",
        }}
      >
        <input {...getInputProps()} />
        <Typography>
          {isDragActive
            ? "Drop the CSV file here..."
            : "Drag and drop a CSV file here, or click to select a file"}
        </Typography>
      </div>

      {csvData.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{ maxHeight: 300, overflow: "auto" }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {csvData[0].slice(0, 4).map((header, i) => (
                  <TableCell key={i}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {csvData.slice(1).map((row, i) => (
                <TableRow key={i}>
                  {row.slice(0, 4).map((cell, j) => (
                    <TableCell key={j}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {showFirstAccordion && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {!showSecondAccordion && <CircularProgress size={20} />}
              <Typography>Finding Common Caption Themes</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <ul style={{ paddingLeft: "24px" }}>
              <li>Empowerment/Personal Choice</li>
              <li>Convenience</li>
              <li>Non-Estrogen Formula</li>
              <li>Safety & Effectiveness</li>
            </ul>
          </AccordionDetails>
        </Accordion>
      )}

      {showSecondAccordion && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {!showThirdAccordion && <CircularProgress size={20} />}
              <Typography>Categorizing Common Themes</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer
              component={Paper}
              sx={{ maxHeight: 300, overflow: "auto" }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {csvData[0]?.map((header, i) => (
                      <TableCell key={i}>{header}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {csvData.slice(1).map((row, i) => (
                    <TableRow key={i}>
                      {row.map((cell, j) => (
                        <TableCell key={j}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      )}

      {showThirdAccordion && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography>Grouped Themes by CTR</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer
              component={Paper}
              sx={{ maxHeight: 300, overflow: "auto" }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Themes</TableCell>
                    <TableCell>Average CTR</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupedThemes.map((row) => (
                    <TableRow key={row.theme}>
                      <TableCell>{row.theme}</TableCell>
                      <TableCell>{row.averageCTR}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};

export default Agent2;
