import React, { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Button,
  TextField,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Drawer,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";

const QUESTION_CATEGORIES = {
  "Awareness & Reach": {
    "Top Posts & Average Impressions":
      "What are the top 5 posts by impressions, and what is the average impression count across all posts?",
    "Reach Rate by Post Type":
      "Calculate the mean reach rate for each post type (carousels, single images, reels) and display them in descending order.",
    "Monthly Impression Trends":
      "Create a monthly trend analysis of average impressions, grouping by created_date.",
    "Hourly Distribution & Reach":
      "What is the distribution of posts across different hours of the day, and what's the average reach for each hour?",
    "Organic vs Promoted Reach":
      "Calculate the percentage of organic reach versus promoted reach for each month, showing the trend over time.",
  },
  "Engagement & Interest": {
    "Content Type Engagement":
      "Compare the mean engagement rate across different content types and display the results sorted by engagement rate.",
    "Followers vs Engagement":
      "Create a scatter plot showing the relationship between followers and engagement rate, including the correlation coefficient.",
    "Organic vs Promoted Engagement":
      "Calculate and compare the average engagement metrics (likes, comments, shares) for organic vs promoted posts.",
    "Comment-Like Ratio Analysis":
      "What is the average comment-to-like ratio, and which posts exceed 2 standard deviations from this mean?",
    "Post Type Engagement Metrics":
      "Group posts by type and calculate the median engagement rate, engagement count, and total interactions for each group.",
  },
  "Conversions & Action": {
    "Save Rate Analysis":
      "What are the average save rates by post type, and which posts have save rates above the 90th percentile?",
    "Profile Visit Correlations":
      "Calculate the correlation matrix between profile visits and other engagement metrics (likes, comments, shares, saves).",
    "Share-Impression Analysis":
      "Compare the share-to-impression ratio across different content formats, showing statistical significance.",
    "Time Bracket Performance":
      "Analyze post timing by grouping into time brackets and calculating the mean conversion actions for each bracket.",
    "Save Rate Percentiles":
      "Create a DataFrame showing save rate percentiles (25th, 50th, 75th, 90th) grouped by content type.",
  },
};

const AnalyticsDashboard = () => {
  const [csvData, setCsvData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [analysisResults, setAnalysisResults] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");

  // File Upload Handler
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            setCsvData(results.data);
            setError("");
          }
        },
        header: true,
        error: (error) => {
          setError("Error parsing CSV file: " + error.message);
        },
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
  });

  // Mock Analysis Function
  const analyzeData = async (question) => {
    setCurrentQuestion(question);
    setIsAnalyzing(true);

    // Simulate API call/analysis
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockResult = `Analysis complete for: ${question}. 
      This is a placeholder for the actual analysis results that would come from the backend.`;

    setAnalysisResults((prev) => ({
      ...prev,
      [question]: mockResult,
    }));

    setIsAnalyzing(false);
  };

  // Start Analysis for Category
  const startCategoryAnalysis = async (category) => {
    setSelectedCategory(category);
    setSummary("");
    setAnalysisResults({});

    const questions = QUESTION_CATEGORIES[category];
    for (const [title, question] of Object.entries(questions)) {
      await analyzeData(question);
    }

    // Generate summary after all analyses complete
    setSummary(`Summary of ${category} Analysis:
      • Key finding 1: Placeholder for first key finding
      • Key finding 2: Placeholder for second key finding
      • Key finding 3: Placeholder for third key finding`);
  };

  // Render File Upload Section
  const renderFileUpload = () => (
    <Paper
      {...getRootProps()}
      sx={{
        p: 3,
        textAlign: "center",
        cursor: "pointer",
        backgroundColor: isDragActive ? "#f0f8ff" : "white",
        border: "2px dashed #ccc",
      }}
    >
      <input {...getInputProps()} />
      <Typography variant="h6">
        {isDragActive
          ? "Drop CSV here"
          : "Drag & drop CSV file here, or click to select"}
      </Typography>
    </Paper>
  );

  // Render CSV Preview
  const renderCsvPreview = () => (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>CSV Preview</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {csvData &&
                  Object.keys(csvData[0]).map((header, index) => (
                    <TableCell key={index}>{header}</TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {csvData?.slice(0, 5).map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Object.values(row).map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );

  // Render Category Selection
  const renderCategorySelection = () => (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 2,
        mt: 2,
      }}
    >
      {Object.keys(QUESTION_CATEGORIES).map((category) => (
        <Card
          key={category}
          sx={{
            cursor: "pointer",
            "&:hover": { boxShadow: 6 },
          }}
          onClick={() => startCategoryAnalysis(category)}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {category}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Object.keys(QUESTION_CATEGORIES[category]).length} questions
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  // Render Analysis Results
  const renderAnalysis = () => (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => setSelectedCategory(null)}
        sx={{ mb: 2 }}
      >
        Back to Categories
      </Button>

      {Object.entries(QUESTION_CATEGORIES[selectedCategory]).map(
        ([title, question]) => (
          <Accordion key={title}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Question: {question}
              </Typography>
              {currentQuestion === question && isAnalyzing ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <CircularProgress size={20} />
                  <Typography>Analyzing...</Typography>
                </Box>
              ) : (
                <Typography>
                  {analysisResults[question] || "Analysis pending..."}
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        )
      )}

      {summary && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Summary
          </Typography>
          <Typography whiteSpace="pre-line">{summary}</Typography>
        </Paper>
      )}
    </Box>
  );

  // Render Follow-up Question Input
  const renderFollowUpInput = () => (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        p: 2,
        backgroundColor: "white",
        boxShadow: 3,
      }}
    >
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask a follow-up question..."
          value={followUpQuestion}
          onChange={(e) => setFollowUpQuestion(e.target.value)}
        />
        <IconButton
          color="primary"
          onClick={() => {
            // Handle follow-up question
            setFollowUpQuestion("");
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ pb: 10 }}>
      <Typography variant="h4" sx={{ my: 3 }}>
        Social Media Analytics Dashboard
      </Typography>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      {!csvData && renderFileUpload()}

      {csvData && !selectedCategory && (
        <>
          {renderCsvPreview()}
          {renderCategorySelection()}
        </>
      )}

      {selectedCategory && renderAnalysis()}

      {csvData && renderFollowUpInput()}
    </Container>
  );
};

export default AnalyticsDashboard;
