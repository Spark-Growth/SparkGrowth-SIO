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

# Load data
@st.cache_data
def load_data():
    return pd.read_csv('posts_slyndrx_12_3_24.csv')

df = load_data()

# Initialize OpenAI LLM and Pandas agent
@st.cache_resource
def get_agent():
    llm = ChatOpenAI(
        model="gpt-4",
        temperature=0
    )
    return create_pandas_dataframe_agent(
        llm,
        df,
        verbose=True,
        agent_type=AgentType.OPENAI_FUNCTIONS
    )

agent = get_agent()

# Analysis questions
# QUESTIONS = {
#     "Average Reach by Type": "What's the average reach and impressions across different post types?",
#     "Top Organic Posts": "Which posts achieved the highest organic reach and what were their characteristics?",
#     "Promoted vs Organic": "How does promoted content perform compared to organic in terms of reach?",
#     "Reach Rate Patterns": "What patterns emerge in reach rate across different content types?",
#     "Timing Impact": "Is there a correlation between post timing and reach performance?",
#     "Content Themes": "What content themes/topics generate the highest impressions?",
#     "Time Trends": "How has reach performance trended over time?",
#     "Engagement-Reach Relationship": "What's the relationship between engagement and reach for different post types?"
# }


QUESTIONS = {
    "Average Reach by Type": "What's the average reach and impressions across different post types?",
    "Top Organic Posts": "Which posts achieved the highest organic reach and what were their characteristics?",
    "Promoted vs Organic": "How does promoted content perform compared to organic in terms of reach?",
    # "Reach Rate Patterns": "What patterns emerge in reach rate across different content types?",
    # "Timing Impact": "Is there a correlation between post timing and reach performance?",
    # "Content Themes": "What content themes/topics generate the highest impressions?",
    # "Time Trends": "How has reach performance trended over time?",
    # "Engagement-Reach Relationship": "What's the relationship between engagement and reach for different post types?"
}

def run_analysis():
    """Run the analysis for each question"""
    for title, question in QUESTIONS.items():
        if title not in st.session_state.analysis_results:
            try:
                # Get the expander object from session state
                expander = st.session_state.expanders[title]
                with expander:
                    st.markdown("**Analyzing...**")
                    # Create a placeholder for the agent's thoughts
                    thoughts_placeholder = st.empty()
                    
                    # Capture and display the agent's thoughts
                    with st.spinner("Agent is thinking..."):
                        response = agent.invoke(question)
                        st.session_state.analysis_results[title] = response["output"]
                    
                    # Clear "Analyzing..." message
                    st.markdown("**Analysis:**")
                    st.markdown(response["output"])
            except Exception as e:
                st.session_state.analysis_results[title] = f"Error analyzing data: {str(e)}"
    
    # Generate summary after all analyses are complete
    with st.spinner("Generating summary..."):
        summary_prompt = """Based on the analysis results above, what are the 3-5 most interesting and actionable conclusions? 
        Format the response as bullet points. Focus on insights that could improve content strategy."""
        try:
            all_insights = "\n".join(st.session_state.analysis_results.values())
            summary_response = agent.invoke(f"Here are the analysis results:\n{all_insights}\n\n{summary_prompt}")
            st.session_state.summary = summary_response["output"]
        except Exception as e:
            st.session_state.summary = f"Error generating summary: {str(e)}"

# UI Elements
st.title("Slyndrx Posts Data Analysis 📊")
st.markdown("""
This tool performs a comprehensive analysis of the Slyndrx social media posts dataset, examining reach, engagement, and content performance patterns.
""")

# Initialize expanders in session state
if "expanders" not in st.session_state:
    st.session_state.expanders = {}

# Create all expanders first
for title, question in QUESTIONS.items():
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
    st.markdown("### 🎯 Key Insights & Recommendations")
    st.markdown(st.session_state.summary)

# Add data preview section
with st.expander("Preview Dataset", expanded=False):
    st.dataframe(df.head())
