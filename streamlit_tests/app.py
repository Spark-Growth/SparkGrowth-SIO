import streamlit as st
import pandas as pd
from langchain_experimental.agents.agent_toolkits import create_pandas_dataframe_agent
from langchain_openai import ChatOpenAI
from langchain.agents.agent_types import AgentType
from dotenv import load_dotenv

load_dotenv()

# Page config
st.set_page_config(page_title="Slyndrx Posts Analyzer", page_icon="📊", layout="wide")

# Initialize session state
if "analysis_started" not in st.session_state:
    st.session_state.analysis_started = False
if "analysis_results" not in st.session_state:
    st.session_state.analysis_results = {}
if "summary" not in st.session_state:
    st.session_state.summary = ""
if "selected_category" not in st.session_state:
    st.session_state.selected_category = None

# Sidebar for file upload
uploaded_file = st.sidebar.file_uploader("Upload a CSV file", type="csv")

# Load data
@st.cache_data
def load_data(file):
    try:
        df = pd.read_csv(file)
        if df.empty:
            st.error("The uploaded CSV file is empty. Please upload a valid file.")
            st.stop()
        return df
    except Exception as e:
        st.error(f"Error loading CSV file: {e}")
        st.stop()

if uploaded_file:
    df = load_data(uploaded_file)
else:
    st.sidebar.warning("Please upload a CSV file to proceed.")
    st.stop()

# Initialize OpenAI LLM and Pandas agent
@st.cache_resource
def get_agent():
    try:
        llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0
        )
        return create_pandas_dataframe_agent(
            llm,
            df,
            verbose=True,
            agent_type=AgentType.OPENAI_FUNCTIONS,
            allow_dangerous_code=True  #
        )
    except ValueError as e:
        st.error(f"Error creating agent: {e}")
        st.stop()

agent = get_agent()

# Analysis questions by category
QUESTION_CATEGORIES = {
    "Awareness & Reach": {
        "Top Posts & Average Impressions": "What are the top 5 posts by impressions, and what is the average impression count across all posts?",
        "Reach Rate by Post Type": "Calculate the mean reach rate for each post type (carousels, single images, reels) and display them in descending order.",
        "Monthly Impression Trends": "Create a monthly trend analysis of average impressions, grouping by created_date.",
        "Hourly Distribution & Reach": "What is the distribution of posts across different hours of the day, and what's the average reach for each hour?",
        "Organic vs Promoted Reach": "Calculate the percentage of organic reach versus promoted reach for each month, showing the trend over time."
    },
    "Engagement & Interest": {
        "Content Type Engagement": "Compare the mean engagement rate across different content types and display the results sorted by engagement rate.",
        "Followers vs Engagement": "Create a scatter plot showing the relationship between followers and engagement rate, including the correlation coefficient.",
        "Organic vs Promoted Engagement": "Calculate and compare the average engagement metrics (likes, comments, shares) for organic vs promoted posts.",
        "Comment-Like Ratio Analysis": "What is the average comment-to-like ratio, and which posts exceed 2 standard deviations from this mean?",
        "Post Type Engagement Metrics": "Group posts by type and calculate the median engagement rate, engagement count, and total interactions for each group."
    },
    "Conversions & Action": {
        "Save Rate Analysis": "What are the average save rates by post type, and which posts have save rates above the 90th percentile?",
        "Profile Visit Correlations": "Calculate the correlation matrix between profile visits and other engagement metrics (likes, comments, shares, saves).",
        "Share-Impression Analysis": "Compare the share-to-impression ratio across different content formats, showing statistical significance.",
        "Time Bracket Performance": "Analyze post timing by grouping into time brackets and calculating the mean conversion actions for each bracket.",
        "Save Rate Percentiles": "Create a DataFrame showing save rate percentiles (25th, 50th, 75th, 90th) grouped by content type."
    }
}

def run_analysis():
    """Run the analysis for each question in the selected category"""
    if st.session_state.selected_category:
        questions = QUESTION_CATEGORIES[st.session_state.selected_category]
        for title, question in questions.items():
            if title not in st.session_state.analysis_results:
                try:
                    expander = st.session_state.expanders[title]
                    with expander:
                        st.markdown("**Analyzing...**")
                        with st.spinner("Agent is thinking..."):
                            response = agent.invoke(question)
                            st.session_state.analysis_results[title] = response["output"]
                        st.markdown("**Analysis:**")
                        st.markdown(response["output"])
                except Exception as e:
                    st.session_state.analysis_results[title] = f"Error analyzing data: {str(e)}"
        
        # Generate summary
        with st.spinner("Generating summary..."):
            summary_prompt = f"""Based on the analysis results for {st.session_state.selected_category}, what are the 3-5 most interesting and actionable conclusions? 
            Format the response as bullet points. Focus on insights that could improve content strategy."""
            try:
                category_insights = "\n".join([st.session_state.analysis_results[title] 
                                            for title in QUESTION_CATEGORIES[st.session_state.selected_category].keys()])
                summary_response = agent.invoke(f"Here are the analysis results:\n{category_insights}\n\n{summary_prompt}")
                st.session_state.summary = summary_response["output"]
            except Exception as e:
                st.session_state.summary = f"Error generating summary: {str(e)}"

# UI Elements
st.title("Slyndrx Posts Data Analysis 📊")
st.markdown("""
This tool performs a comprehensive analysis of the Slyndrx social media posts dataset. Choose a category to analyze specific aspects of post performance.
""")

# Category selection
selected_category = st.selectbox(
    "Select Analysis Category",
    options=list(QUESTION_CATEGORIES.keys()),
    index=None,
    placeholder="Choose a category..."
)

if selected_category != st.session_state.selected_category:
    st.session_state.selected_category = selected_category
    st.session_state.analysis_started = False
    st.session_state.analysis_results = {}
    st.session_state.summary = ""

if st.session_state.selected_category:
    # Initialize expanders in session state
    if "expanders" not in st.session_state:
        st.session_state.expanders = {}

    # Create expanders for selected category
    for title, question in QUESTION_CATEGORIES[st.session_state.selected_category].items():
        expander = st.expander(f"📊 {title}", expanded=False)
        st.session_state.expanders[title] = expander
        with expander:
            st.markdown("**Question:**")
            st.markdown(f"_{question}_")
            if title in st.session_state.analysis_results:
                st.markdown("**Analysis:**")
                st.markdown(st.session_state.analysis_results[title])
            else:
                st.markdown("Analysis pending...")

    # Start Analysis button
    if not st.session_state.analysis_started:
        if st.button("Start Analysis", type="primary"):
            st.session_state.analysis_started = True
            run_analysis()

    # Display summary if analysis is complete
    if st.session_state.summary:
        st.markdown("---")
        st.markdown(f"### 🎯 Key Insights & Recommendations - {st.session_state.selected_category}")
        st.markdown(st.session_state.summary)

# Add data preview section
with st.expander("Preview Dataset", expanded=False):
    st.dataframe(df.head())
