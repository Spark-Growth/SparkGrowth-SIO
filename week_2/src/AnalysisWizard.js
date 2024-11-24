import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  LinearProgress,
  Grid,
  Paper,
  Fade,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import {
  CloudUpload,
  TrendingUp,
  People,
  ShoppingCart,
  Analytics,
  Timeline,
  Lightbulb,
  CheckCircle,
  InfoOutlined,
  ArrowForward,
  ExpandMore,
} from "@mui/icons-material";

const AnalysisWizard = () => {
  // Stage management
  const [stage, setStage] = useState("upload"); // upload, goal, analyzing, results
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [visibleInsights, setVisibleInsights] = useState([]);
  const [data, setData] = useState(null);
  const [expanded, setExpanded] = useState(true);

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "text/csv": [".csv"],
    },
    onDrop: async (files) => {
      try {
        // Load the test stats instead of parsing the uploaded file
        const response = await fetch("/test_stats.json");
        const jsonData = await response.json();

        setData({
          fileName: files[0].name,
          rowCount: jsonData.length,
          preview: jsonData.slice(0, 5), // Preview first 5 entries
        });

        setTimeout(() => setStage("goal"), 1500);
      } catch (error) {
        console.error("Error loading test stats:", error);
      }
    },
  });

  // Predefined insights based on funnel stage
  const insights = {
    topFunnel: [
      {
        title: "Morning Post Success",
        description: "Posts between 8-10 AM show 20% higher reach",
        tooltipInfo:
          "Analysis of 3-month posting data shows consistent performance peaks during morning hours. Posts published between 8-10 AM averaged 2,300 impressions compared to 1,840 impressions during other times. This trend is particularly strong on weekdays, with Tuesday and Wednesday mornings showing the highest engagement rates. Consider scheduling your most important content during these optimal time slots.",
        confidence: 87,
        metric: "+20%",
        trend: "positive",
      },
      {
        title: "Video Performance",
        description: "Video content reaches 35% more users consistently",
        tooltipInfo:
          "Video posts have significantly outperformed static images across all metrics. Average video view duration is 15 seconds, with a 65% completion rate. Stories featuring product demonstrations and behind-the-scenes content performed particularly well, generating 2.5x more saves and shares compared to other content types. Recommended focus on 15-30 second video formats for optimal engagement.",
        confidence: 92,
        metric: "+35%",
        trend: "positive",
      },
      {
        title: "Caption Length Impact",
        description: "Posts with <100 characters perform better for awareness",
        tooltipInfo:
          "Short, concise captions show higher impression rates in awareness campaigns. Analysis of 50+ posts reveals that captions under 100 characters achieved 25% higher reach compared to longer posts. This effect is most pronounced in mobile-first placements where users typically scroll quickly. Consider front-loading key messages and calls-to-action within the first line of text.",
        confidence: 84,
        metric: "-25%",
        trend: "negative",
      },
    ],
    midFunnel: [
      // Similar structure for mid-funnel insights
    ],
    bottomFunnel: [
      // Similar structure for bottom-funnel insights
    ],
  };

  // Simulated analysis sequence
  useEffect(() => {
    if (stage === "analyzing") {
      const stages = [
        { message: "Analyzing performance data...", progress: 25 },
        { message: "Discovering patterns...", progress: 50 },
        { message: "Generating insights...", progress: 75 },
        { message: "Preparing recommendations...", progress: 100 },
      ];

      stages.forEach(({ progress }, index) => {
        setTimeout(() => {
          setAnalysisProgress(progress);
          if (progress === 100) {
            setTimeout(() => {
              setStage("results");
              revealInsights();
            }, 1000);
          }
        }, 2000 * (index + 1));
      });
    }
  }, [stage]);

  // Reveal insights progressively
  const revealInsights = () => {
    const relevantInsights = insights[selectedGoal] || [];
    relevantInsights.forEach((insight, index) => {
      setTimeout(() => {
        setVisibleInsights((prev) => [...prev, insight]);
      }, 1000 * (index + 1));
    });
  };

  // Render functions for each stage
  const renderUpload = () => (
    <Box sx={{ textAlign: "center", p: 4 }}>
      <Paper
        {...getRootProps()}
        sx={{
          p: 6,
          border: "2px dashed",
          borderColor: isDragActive ? "primary.main" : "grey.300",
          bgcolor: "grey.50",
          cursor: "pointer",
          "&:hover": {
            borderColor: "primary.main",
            bgcolor: "grey.100",
          },
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {isDragActive
            ? "Drop your CSV file here"
            : "Drag & drop your ad performance CSV"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          or click to select file
        </Typography>
      </Paper>
    </Box>
  );

  const renderGoalSelection = () => (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        What are you trying to optimize for?
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {[
          {
            id: "topFunnel",
            title: "Awareness & Reach",
            icon: <People />,
            metrics: ["Impressions", "CPM", "Reach"],
          },
          {
            id: "midFunnel",
            title: "Engagement & Interest",
            icon: <Timeline />,
            metrics: ["Engagement Rate", "CTR", "Cost per Engagement"],
          },
          {
            id: "bottomFunnel",
            title: "Conversions & Action",
            icon: <ShoppingCart />,
            metrics: ["Conversion Rate", "CPA", "ROI"],
          },
        ].map((goal) => (
          <Grid item xs={12} md={4} key={goal.id}>
            <Card
              sx={{
                cursor: "pointer",
                transform: selectedGoal === goal.id ? "scale(1.02)" : "none",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.02)",
                  outline: "2px solid rgba(33, 150, 243, 0.3)", // Light blue outline on hover
                },
                outline:
                  selectedGoal === goal.id
                    ? "2px solid rgba(33, 150, 243, 0.7)"
                    : "none", // Stronger blue outline when selected
              }}
              onClick={() => setSelectedGoal(goal.id)}
              raised={selectedGoal === goal.id}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  {goal.icon}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {goal.title}
                  </Typography>
                </Box>
                <Stack spacing={1}>
                  {goal.metrics.map((metric) => (
                    <Chip
                      key={metric}
                      label={metric}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {selectedGoal && (
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={() => setStage("analyzing")}
          >
            Analyze Data
          </Button>
        </Box>
      )}
    </Box>
  );

  const renderAnalyzing = () => (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <LinearProgress
        variant="determinate"
        value={analysisProgress}
        sx={{ mb: 4, height: 8, borderRadius: 4 }}
      />
      <Typography variant="h6" gutterBottom>
        {analysisProgress < 25 && "Analyzing performance data..."}
        {analysisProgress >= 25 &&
          analysisProgress < 50 &&
          "Discovering patterns..."}
        {analysisProgress >= 50 &&
          analysisProgress < 75 &&
          "Generating insights..."}
        {analysisProgress >= 75 && "Preparing recommendations..."}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {analysisProgress}% Complete
      </Typography>
    </Box>
  );

  const renderResults = () => (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Analysis Results
      </Typography>

      {/* Top Performers Chart */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Performance Distribution
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={[
              { name: "Top 20%", value: 85 },
              { name: "Average", value: 50 },
              { name: "Bottom 20%", value: 25 },
            ]}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <RechartsTooltip />
            <Bar dataKey="value" fill="#2E5C87" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* Key Insights */}
      <Grid container spacing={3}>
        {visibleInsights.map((insight, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Fade in timeout={1000}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {insight.title}
                    </Typography>
                    <Tooltip
                      title={
                        <Typography sx={{ p: 1 }}>
                          {insight.tooltipInfo}
                        </Typography>
                      }
                      arrow
                    >
                      <IconButton size="small">
                        <InfoOutlined />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {insight.description}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Chip
                      label={`${insight.confidence}% confidence`}
                      size="small"
                      color="primary"
                    />
                    <Typography
                      variant="h6"
                      color={
                        insight.trend === "positive"
                          ? "success.main"
                          : "error.main"
                      }
                    >
                      {insight.metric}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {/* Recommendations */}
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" size="large" endIcon={<CheckCircle />}>
          Export Analysis
        </Button>
      </Box>
    </Box>
  );

  // Create a new component for the data preview
  const DataPreview = () =>
    data && (
      <Accordion
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
        sx={{ mt: 3 }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>
            Data Preview: {data.fileName} ({data.rowCount} rows)
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {Object.keys(data.preview[0]).map((header) => (
                    <TableCell key={header} sx={{ fontWeight: "bold" }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.preview.map((row, index) => (
                  <TableRow key={index}>
                    {Object.values(row).map((cell, cellIndex) => (
                      <TableCell key={cellIndex}>
                        {typeof cell === "number"
                          ? Number(cell).toLocaleString()
                          : cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
    );

  // Main render
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50" }}>
      {stage === "upload" && (
        <>
          {renderUpload()}
          <DataPreview />
        </>
      )}
      {stage === "goal" && (
        <>
          {renderGoalSelection()}
          <DataPreview />
        </>
      )}
      {stage === "analyzing" && (
        <>
          {renderAnalyzing()}
          <DataPreview />
        </>
      )}
      {stage === "results" && (
        <>
          {renderResults()}
          <DataPreview />
        </>
      )}
    </Box>
  );
};

export default AnalysisWizard;
