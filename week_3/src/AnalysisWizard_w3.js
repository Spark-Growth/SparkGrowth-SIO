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
import { InstagramEmbed } from "react-social-media-embed";

const AnalysisWizard = () => {
  // Stage management
  const [stage, setStage] = useState("upload"); // upload, goal, analyzing, results
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [visibleInsights, setVisibleInsights] = useState([]);
  const [data, setData] = useState(null);
  const [expanded, setExpanded] = useState(true);
  const [embedError, setEmbedError] = useState(false);

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
          "Analysis of 3-month posting data shows consistent performance peaks during morning hours",
        confidence: 87,
        metric: "+20%",
        trend: "positive",
        detailed_analysis: {
          methodology: {
            data_points: "384 posts analyzed over Q4 2023",
            approach: "Time-series analysis with engagement rate comparison",
            statistical_significance: {
              p_value: 0.002,
              confidence_interval: "95%",
              sample_size: 384,
            },
          },
          performance_breakdown: {
            morning_posts: {
              count: 156,
              avg_engagement: "4.2%",
              avg_reach: 28400,
              avg_saves: 145,
            },
            other_times: {
              count: 228,
              avg_engagement: "2.8%",
              avg_reach: 18200,
              avg_saves: 89,
            },
          },
          optimal_windows: [
            {
              time: "8:15 AM - 10:30 AM",
              performance: "Best",
              avg_lift: "+20%",
            },
            {
              time: "12:00 PM - 1:30 PM",
              performance: "Second Best",
              avg_lift: "+12%",
            },
            {
              time: "After 8:00 PM",
              performance: "Worst",
              avg_decline: "-15%",
            },
          ],
          historical_trend: {
            quarterly_performance: [
              { period: "Q1 2023", morning_lift: "12%" },
              { period: "Q2 2023", morning_lift: "15%" },
              { period: "Q3 2023", morning_lift: "18%" },
              { period: "Q4 2023", morning_lift: "20%" },
            ],
            trend_direction: "Consistently improving",
            seasonal_factors: [
              "Strongest on Tuesday/Wednesday",
              "Weaker on weekends",
              "Holiday periods show different patterns",
            ],
          },
          business_impact: {
            projected_benefits: {
              monthly_reach_increase: 28000,
              engagement_lift: 1200,
              estimated_ad_spend_savings: 3400,
            },
            industry_comparison: {
              your_performance: "4.2%",
              industry_average: "2.8%",
              percentile: "85th",
            },
          },
          action_plan: [
            {
              action: "Shift posting schedule to 8:15-10:30 AM",
              impact: "High",
              effort: "Low",
              timeline: "Immediate",
            },
            {
              action: "Prepare content day before for morning posting",
              impact: "Medium",
              effort: "Medium",
              timeline: "1 week",
            },
            {
              action: "A/B test different morning time slots",
              impact: "Medium",
              effort: "High",
              timeline: "1 month",
            },
          ],
        },
        example_posts: [
          "https://www.instagram.com/p/DCZlBeEuD6S/?utm_source=ig_web_copy_link",
          "https://www.instagram.com/p/C-V_c8_v0jt/?utm_source=ig_web_copy_link",
        ],
      },
      {
        title: "Video Performance",
        description: "Video content reaches 35% more users consistently",
        tooltipInfo:
          "Video posts significantly outperform static images across all metrics",
        confidence: 92,
        metric: "+35%",
        trend: "positive",
        detailed_analysis: {
          methodology: {
            data_points: "256 videos vs 312 images in Q4 2023",
            approach: "Comparative analysis across content types",
            statistical_significance: {
              p_value: 0.001,
              confidence_interval: "98%",
              sample_size: 568,
            },
          },
          performance_breakdown: {
            video_content: {
              count: 256,
              avg_engagement: "5.8%",
              avg_reach: 32600,
              avg_watch_time: "15 seconds",
              completion_rate: "65%",
            },
            static_content: {
              count: 312,
              avg_engagement: "3.2%",
              avg_reach: 21400,
              avg_save_rate: "2.1%",
            },
          },
          best_performing_types: [
            {
              type: "Product Demonstrations",
              engagement_lift: "+45%",
              avg_watch_time: "18 seconds",
            },
            {
              type: "Behind-the-Scenes",
              engagement_lift: "+38%",
              avg_watch_time: "22 seconds",
            },
            {
              type: "Tutorial Content",
              engagement_lift: "+32%",
              avg_watch_time: "25 seconds",
            },
          ],
          historical_trend: {
            quarterly_performance: [
              { period: "Q1 2023", video_lift: "28%" },
              { period: "Q2 2023", video_lift: "30%" },
              { period: "Q3 2023", video_lift: "33%" },
              { period: "Q4 2023", video_lift: "35%" },
            ],
            trend_direction: "Steadily increasing",
            platform_changes: [
              "Instagram algorithm favoring video content",
              "Reels receiving additional organic boost",
              "Increased mobile-first consumption",
            ],
          },
          business_impact: {
            projected_benefits: {
              monthly_reach_increase: 35000,
              engagement_lift: 2800,
              estimated_ad_spend_savings: 4200,
            },
            industry_comparison: {
              your_performance: "5.8%",
              industry_average: "3.5%",
              percentile: "92nd",
            },
          },
          action_plan: [
            {
              action: "Increase video content to 60% of posts",
              impact: "High",
              effort: "High",
              timeline: "2 months",
            },
            {
              action: "Focus on 15-30 second format",
              impact: "High",
              effort: "Medium",
              timeline: "Immediate",
            },
            {
              action: "Develop product demonstration series",
              impact: "High",
              effort: "High",
              timeline: "3 months",
            },
          ],
        },
        example_posts: [
          "https://www.instagram.com/reel/C_llniYvN6R/?utm_source=ig_web_copy_link",
          "https://www.instagram.com/p/C4oIbwkNbxN/?utm_source=ig_web_copy_link",
        ],
      },
      {
        title: "Caption Length Impact",
        description: "Posts with <100 characters perform better for awareness",
        tooltipInfo:
          "Short, concise captions show higher impression rates in awareness campaigns",
        confidence: 84,
        metric: "+25%",
        trend: "negative",
        detailed_analysis: {
          methodology: {
            data_points: "428 posts analyzed in Q4 2023",
            approach: "Length-based segmentation analysis",
            statistical_significance: {
              p_value: 0.008,
              confidence_interval: "92%",
              sample_size: 428,
            },
          },
          performance_breakdown: {
            short_captions: {
              count: 186,
              avg_engagement: "4.1%",
              avg_reach: 26800,
              avg_impression_rate: "82%",
            },
            long_captions: {
              count: 242,
              avg_engagement: "3.2%",
              avg_reach: 19200,
              avg_impression_rate: "64%",
            },
          },
          optimal_lengths: [
            {
              length: "Under 100 characters",
              performance: "Best",
              engagement_lift: "+25%",
            },
            {
              length: "100-250 characters",
              performance: "Average",
              engagement_lift: "+5%",
            },
            {
              length: "Over 250 characters",
              performance: "Below Average",
              engagement_decline: "-15%",
            },
          ],
          historical_trend: {
            quarterly_performance: [
              { period: "Q1 2023", short_caption_lift: "18%" },
              { period: "Q2 2023", short_caption_lift: "20%" },
              { period: "Q3 2023", short_caption_lift: "22%" },
              { period: "Q4 2023", short_caption_lift: "25%" },
            ],
            trend_direction: "Impact increasing",
            platform_factors: [
              "Mobile-first browsing behavior",
              "Decreasing attention spans",
              "Algorithm favoring quick engagement",
            ],
          },
          business_impact: {
            projected_benefits: {
              monthly_reach_increase: 22000,
              engagement_lift: 900,
              estimated_ad_spend_savings: 2800,
            },
            industry_comparison: {
              your_performance: "4.1%",
              industry_average: "3.4%",
              percentile: "78th",
            },
          },
          action_plan: [
            {
              action: "Implement 100 character caption limit",
              impact: "High",
              effort: "Low",
              timeline: "Immediate",
            },
            {
              action: "Create caption templates",
              impact: "Medium",
              effort: "Medium",
              timeline: "2 weeks",
            },
            {
              action: "Test caption-free posts",
              impact: "Medium",
              effort: "Low",
              timeline: "1 month",
            },
          ],
        },
        example_posts: [
          "https://www.instagram.com/p/C9SxpKLuaJK/?utm_source=ig_web_copy_link",
          "https://www.instagram.com/p/C9DHO5zvW_1/?utm_source=ig_web_copy_link",
        ],
      },
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

      {/* Performance Distribution Chart - keeping your existing chart */}
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

      {/* Key Insights with Detailed Analysis */}
      <Grid container spacing={3}>
        {visibleInsights.map((insight, index) => (
          <Grid item xs={12} key={index}>
            <Fade in timeout={1000}>
              <Card>
                {/* High-level Summary */}
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6">{insight.title}</Typography>
                    <Box>
                      <Chip
                        label={`${insight.confidence}% confidence`}
                        size="small"
                        color="primary"
                        sx={{ mr: 1 }}
                      />
                      <Typography
                        variant="h6"
                        component="span"
                        color={
                          insight.trend === "positive"
                            ? "success.main"
                            : "error.main"
                        }
                      >
                        {insight.metric}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body1" gutterBottom>
                    {insight.description}
                  </Typography>
                </CardContent>

                {/* Detailed Analysis Sections */}
                <CardContent>
                  <Grid container spacing={3}>
                    {/* Methodology Section */}
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Methodology & Data
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                              <Paper variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                  Analysis Approach
                                </Typography>
                                <Typography variant="body2">
                                  {
                                    insight.detailed_analysis.methodology
                                      .data_points
                                  }
                                </Typography>
                                <Typography variant="body2">
                                  {
                                    insight.detailed_analysis.methodology
                                      .approach
                                  }
                                </Typography>
                              </Paper>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Paper variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                  Statistical Significance
                                </Typography>
                                <Typography variant="body2">
                                  P-value:{" "}
                                  {
                                    insight.detailed_analysis.methodology
                                      .statistical_significance.p_value
                                  }
                                </Typography>
                                <Typography variant="body2">
                                  Confidence:{" "}
                                  {
                                    insight.detailed_analysis.methodology
                                      .statistical_significance
                                      .confidence_interval
                                  }
                                </Typography>
                                <Typography variant="body2">
                                  Sample size:{" "}
                                  {
                                    insight.detailed_analysis.methodology
                                      .statistical_significance.sample_size
                                  }
                                </Typography>
                              </Paper>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>

                    {/* Performance Breakdown */}
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Performance Analysis
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            {Object.entries(
                              insight.detailed_analysis.performance_breakdown
                            ).map(([key, value]) => (
                              <Grid item xs={12} md={6} key={key}>
                                <Paper variant="outlined" sx={{ p: 2 }}>
                                  <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                    sx={{ textTransform: "capitalize" }}
                                  >
                                    {key.replace("_", " ")}
                                  </Typography>
                                  {Object.entries(value).map(
                                    ([metric, val]) => (
                                      <Box
                                        key={metric}
                                        sx={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          my: 1,
                                        }}
                                      >
                                        <Typography
                                          variant="body2"
                                          sx={{ textTransform: "capitalize" }}
                                        >
                                          {metric.replace("_", " ")}:
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          fontWeight="bold"
                                        >
                                          {val}
                                        </Typography>
                                      </Box>
                                    )
                                  )}
                                </Paper>
                              </Grid>
                            ))}
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>

                    {/* Historical Trends */}
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Historical Trends
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <TableContainer
                                component={Paper}
                                variant="outlined"
                              >
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Period</TableCell>
                                      <TableCell align="right">
                                        Performance Lift
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {insight.detailed_analysis.historical_trend.quarterly_performance.map(
                                      (quarter) => (
                                        <TableRow key={quarter.period}>
                                          <TableCell>
                                            {quarter.period}
                                          </TableCell>
                                          <TableCell align="right">
                                            {quarter[Object.keys(quarter)[1]]}
                                          </TableCell>
                                        </TableRow>
                                      )
                                    )}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>

                    {/* Action Plan */}
                    <Grid item xs={12}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Recommended Actions
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            {insight.detailed_analysis.action_plan.map(
                              (action, i) => (
                                <Grid item xs={12} key={i}>
                                  <Paper variant="outlined" sx={{ p: 2 }}>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Typography variant="subtitle2">
                                        {action.action}
                                      </Typography>
                                      <Box>
                                        <Chip
                                          label={`Impact: ${action.impact}`}
                                          size="small"
                                          color={
                                            action.impact === "High"
                                              ? "success"
                                              : "default"
                                          }
                                          sx={{ mr: 1 }}
                                        />
                                        <Chip
                                          label={action.timeline}
                                          size="small"
                                          variant="outlined"
                                        />
                                      </Box>
                                    </Box>
                                  </Paper>
                                </Grid>
                              )
                            )}
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </Grid>

                    {/* Example Posts Section */}
                    {insight.example_posts &&
                      insight.example_posts.length > 0 && (
                        <Grid item xs={12}>
                          <Accordion>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                Example Posts
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid
                                container
                                spacing={2}
                                justifyContent="center"
                              >
                                {insight.example_posts.map((postUrl, idx) => (
                                  <Grid item key={idx}>
                                    <InstagramEmbed
                                      url={postUrl}
                                      width={328}
                                      onError={() => setEmbedError(true)}
                                    />
                                  </Grid>
                                ))}
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                        </Grid>
                      )}
                  </Grid>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      {/* Export Button */}
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
      {embedError && (
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography color="error">
            Some posts couldn't be loaded. Please check your internet connection
            or try again later.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AnalysisWizard;
