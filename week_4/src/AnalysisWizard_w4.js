import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { parse } from "papaparse";
import Anthropic from "@anthropic-ai/sdk";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Paper,
  LinearProgress,
  Fade,
  TextField,
  IconButton,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from "@mui/material";
import {
  CloudUpload,
  People,
  Timeline,
  ShoppingCart,
  ArrowForward,
  ExpandMore,
} from "@mui/icons-material";

const AnalysisWizard = () => {
  // State management
  const [stage, setStage] = useState("upload"); // upload, goal, analyzing, results
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [parsedData, setParsedData] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [previewExpanded, setPreviewExpanded] = useState(true);

  // File upload handling
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "text/csv": [".csv"],
    },
    onDrop: (files) => {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = (e) => {
        const csvText = e.target.result;
        setCsvData(csvText);

        // Synchronously parse CSV
        const results = parse(csvText, {
          header: true,
          skipEmptyLines: true,
        });

        setParsedData({
          fileName: file.name,
          rowCount: results.data.length,
          preview: results.data.slice(0, 5),
          fullData: results.data,
        });

        setStage("goal");
      };

      reader.readAsText(file);
    },
  });

  // Anthropic API integration
  const analyzeData = async () => {
    try {
      const anthropic = new Anthropic({
        apiKey: process.env.REACT_APP_ANTHROPIC_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      const prompt = `You are an expert social media analyst. Analyze this Instagram data and provide 3 key insights focused on ${selectedGoal}.

      The data: ${JSON.stringify(parsedData.fullData)}

      Please provide your analysis in this format:
      {
        "insights": [
          {
            "title": "Clear, impactful title",
            "description": "One-line summary of the insight",
            "justification": "2-3 sentences explaining the data analysis that led to this insight",
            "recommendations": ["2-3 specific, actionable recommendations"],
            "metric": "Key metric with +/- prefix",
            "trend": "positive or negative"
          }
        ],
        "summary": "2-3 sentence overview of the analysis"
      }

      For Awareness/Reach goals, focus on impressions and visibility metrics.
      For Engagement goals, focus on likes, comments, and interaction metrics.
      For Conversion goals, focus on profile visits and action metrics.

      Base all insights on actual patterns in the provided data.`;

      const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      });

      return JSON.parse(message.content[0].text);
    } catch (error) {
      console.error("Analysis error:", error);
      return null;
    }
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;

    const newMessage = { role: "user", content: chatInput };
    setChatHistory((prev) => [...prev, newMessage]);
    setChatInput("");
    setIsTyping(true);

    try {
      const anthropic = new Anthropic({
        apiKey: process.env.REACT_APP_ANTHROPIC_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: `Context: You are analyzing Instagram data. Previous analysis: ${JSON.stringify(
              analysisResults
            )}
            
            Question: ${chatInput}
            
            Please provide a concise, data-backed response.`,
          },
        ],
      });

      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: message.content[0].text,
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle analysis initiation
  const startAnalysis = async () => {
    setStage("analyzing");

    // Simulate progress for UX
    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 25;
      });
    }, 1000);

    const results = await analyzeData();
    setAnalysisResults(results);

    clearInterval(progressInterval);
    setAnalysisProgress(100);
    setTimeout(() => setStage("results"), 500);
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
            : "Drag & drop your Instagram data CSV"}
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
            id: "awareness",
            title: "Awareness & Reach",
            icon: <People />,
            metrics: ["Impressions", "CPM", "Reach"],
          },
          {
            id: "engagement",
            title: "Engagement & Interest",
            icon: <Timeline />,
            metrics: ["Engagement Rate", "CTR", "Cost per Engagement"],
          },
          {
            id: "conversion",
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
                  boxShadow: 3,
                },
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
                <Box>
                  {goal.metrics.map((metric) => (
                    <Chip
                      key={metric}
                      label={metric}
                      size="small"
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>
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
            onClick={startAnalysis}
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

      {analysisResults?.insights.map((insight, index) => (
        <Fade in timeout={1000} key={index}>
          <Card sx={{ mb: 3 }}>
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
                <Chip
                  label={insight.metric}
                  color={insight.trend === "positive" ? "success" : "error"}
                />
              </Box>
              <Typography variant="body1" paragraph>
                {insight.description}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {insight.justification}
              </Typography>
              <Box sx={{ mt: 2 }}>
                {insight.recommendations.map((rec, idx) => (
                  <Typography
                    key={idx}
                    variant="body1"
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    • {rec}
                  </Typography>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Fade>
      ))}

      {/* Chat History */}
      <Box sx={{ mt: 4, mb: 20 }}>
        {chatHistory.map((msg, index) => (
          <Box
            key={index}
            sx={{
              mb: 2,
              textAlign: msg.role === "user" ? "right" : "left",
            }}
          >
            <Paper
              sx={{
                p: 2,
                display: "inline-block",
                maxWidth: "80%",
                bgcolor: msg.role === "user" ? "primary.light" : "grey.100",
                color: msg.role === "user" ? "white" : "inherit",
              }}
            >
              <Typography>{msg.content}</Typography>
            </Paper>
          </Box>
        ))}
        {isTyping && (
          <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            <Typography variant="body2">Analyzing...</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );

  // Data Preview Component
  const DataPreview = () =>
    parsedData && (
      <Accordion
        expanded={previewExpanded}
        onChange={() => setPreviewExpanded(!previewExpanded)}
        sx={{ mt: 3 }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>
            Data Preview: {parsedData.fileName} ({parsedData.rowCount} rows)
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {Object.keys(parsedData.preview[0]).map((header) => (
                    <th
                      key={header}
                      style={{
                        padding: 8,
                        borderBottom: "1px solid #ddd",
                        textAlign: "left",
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsedData.preview.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        style={{ padding: 8, borderBottom: "1px solid #ddd" }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </AccordionDetails>
      </Accordion>
    );

  // Floating chat input
  const renderChatInput = () => (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        maxWidth: 800,
        zIndex: 1000,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 2,
          borderRadius: 30,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <TextField
          fullWidth
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask me anything about your social media performance..."
          variant="standard"
          InputProps={{
            disableUnderline: true,
            sx: { fontSize: "1rem", pl: 2 },
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleChatSubmit();
            }
          }}
        />
        <IconButton
          color="primary"
          onClick={handleChatSubmit}
          sx={{
            bgcolor: "primary.main",
            color: "white",
            "&:hover": {
              bgcolor: "primary.dark",
            },
            width: 40,
            height: 40,
          }}
        >
          <ArrowForward />
        </IconButton>
      </Paper>
    </Box>
  );

  // Main render
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", pb: 10 }}>
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          py: 3,
          borderBottom: 1,
          borderColor: "divider",
          fontWeight: "medium",
        }}
      >
        Social Media Analysis Wizard
      </Typography>

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
          {renderChatInput()}
          <DataPreview />
        </>
      )}
    </Box>
  );
};
export default AnalysisWizard;
