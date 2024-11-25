import { useState, useMemo } from "react";
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Avatar,
} from "@mui/material";
import {
  Share,
  Refresh,
  ThumbUp,
  ThumbDown,
  ContentCopy,
  Edit,
  Search,
  ChevronRight,
} from "@mui/icons-material";

const sources = [
  {
    title: "Oscar winners 2023: See the full list - CNN",
    domain: "edition.cnn",
    icon: "/placeholder.svg?height=20&width=20",
  },
  {
    title: "2023 Oscar Winners: The Full List - The Hollywood Reporter",
    domain: "hollywoodreporter",
    icon: "/placeholder.svg?height=20&width=20",
  },
];

const relatedQuestions = [
  {
    id: "1",
    question: "Who won the award for Best Director at the 2023 Oscars?",
  },
  {
    id: "2",
    question: "What movies were nominated for Best Picture in 2023?",
  },
  {
    id: "3",
    question: "How many Oscars did Everything Everywhere All at Once win?",
  },
];

export default function Perplexity() {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(query);
  };

  const handleRewrite = () => {
    console.log("Rewrite clicked");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: { xs: 2, md: 12 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "800px", spacing: 3 }}>
        {/* Search Bar */}
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{ position: "relative", width: "100%" }}
        >
          <TextField
            fullWidth
            placeholder="Ask anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { pr: 6 } }}
          />
          <IconButton
            type="submit"
            sx={{
              position: "absolute",
              right: 8,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <Search />
          </IconButton>
        </Box>

        {/* Sources */}
        <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
          Sources
        </Typography>
        <Grid container spacing={2}>
          {sources.map((source) => (
            <Grid item xs={12} sm={6} key={source.domain}>
              <Card sx={{ "&:hover": { bgcolor: "action.hover" } }}>
                <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar src={source.icon} sx={{ width: 20, height: 20 }} />
                    <Box sx={{ overflow: "hidden" }}>
                      <Typography variant="body2" noWrap>
                        {source.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {source.domain}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Answer Section */}
        <Card sx={{ mt: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Avatar sx={{ bgcolor: "primary.light", width: 24, height: 24 }}>
                <Box
                  component="svg"
                  viewBox="0 0 24 24"
                  sx={{ width: 16, height: 16, color: "primary.main" }}
                >
                  <path
                    d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </Box>
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2">
                  The 95th Academy Awards, held on March 12, 2023, saw
                  'Everything Everywhere All at Once' dominate with seven Oscar
                  wins, including Best Picture, Best Director (Daniel Kwan and
                  Daniel Scheinert), and Best Actress (Michelle Yeoh). Brendan
                  Fraser won Best Actor for 'The Whale', while the supporting
                  acting awards went to Ke Huy Quan and Jamie Lee Curtis.
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}
                >
                  <Button variant="outlined" size="small" startIcon={<Share />}>
                    Share
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Refresh />}
                    onClick={handleRewrite}
                  >
                    Rewrite
                  </Button>
                  <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
                    <IconButton size="small">
                      <ThumbUp fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <ThumbDown fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <ContentCopy fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <Edit fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Related Questions */}
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Related
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {relatedQuestions.map((q) => (
                <Button
                  key={q.id}
                  variant="text"
                  sx={{
                    justifyContent: "space-between",
                    textAlign: "left",
                    p: 1.5,
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <Typography variant="body2">{q.question}</Typography>
                  <ChevronRight />
                </Button>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
