import streamlit as st
import pandas as pd
from langchain_experimental.agents.agent_toolkits import create_pandas_dataframe_agent
from langchain.chat_models import ChatOpenAI
from langchain.agents.agent_types import AgentType
from dotenv import load_dotenv
import tempfile

load_dotenv()

# Page config
st.set_page_config(page_title="Data Insights Analyzer", page_icon="📊", layout="wide")

# Initialize session state
if "analysis_started" not in st.session_state:
    st.session_state.analysis_started = False
if "analysis_results" not in st.session_state:
    st.session_state.analysis_results = {}
if "summary" not in st.session_state:
    st.session_state.summary = ""
if "selected_category" not in st.session_state:
    st.session_state.selected_category = None
if "agent" not in st.session_state:
    st.session_state.agent = None
if "df" not in st.session_state:
    st.session_state.df = None

# Load data
@st.cache_data
def load_data(uploaded_file):
    return pd.read_csv(uploaded_file)

# Initialize OpenAI LLM and Pandas agent
def get_agent(df):
    llm = ChatOpenAI(
        model_name="gpt-4o-mini",
        temperature=0
    )
    return create_pandas_dataframe_agent(
        llm,
        df,
        verbose=True,
        agent_type=AgentType.OPENAI_FUNCTIONS
    )

# Analysis questions per category
CATEGORY_QUESTIONS = {
    "Awareness & Reach": {
        "Average Reach by Type": "What's the average reach and impressions across different post types?",
        "Top Organic Posts": "Which posts achieved the highest organic reach and what were their characteristics?",
        "Promoted vs Organic": "How does promoted content perform compared to organic in terms of reach?",
    },
    "Engagement & Interest": {
        "Engagement Rates": "What are the engagement rates for different post types?",
        "Top Engaging Posts": "Which posts have the highest engagement and what content do they feature?",
        "Engagement Trends": "How has engagement evolved over time?",
    },
    "Conversions & Action": {
        "Conversion Rates": "What are the conversion rates associated with different posts?",
        "Call-to-Action Effectiveness": "Which calls-to-action are most effective in driving conversions?",
        "Conversion by Audience Segment": "How do conversion rates vary across different audience segments?",
    }
}

def run_analysis(questions, agent):
    """Run the analysis for each question"""
    for title, question in questions.items():
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
                        # Run the agent and capture intermediate steps
                        response = agent(question)
                        st.session_state.analysis_results[title] = response
                        # Display the analysis
                        st.markdown("**Analysis:**")
                        st.markdown(response)
            except Exception as e:
                st.session_state.analysis_results[title] = f"Error analyzing data: {str(e)}"
        
    # Generate summary after all analyses are complete
    with st.spinner("Generating summary..."):
        summary_prompt = """Based on the analysis results above, what are the 3-5 most interesting and actionable conclusions? 
        Format the response as bullet points. Focus on insights that could improve content strategy."""
        try:
            all_insights = "\n".join(st.session_state.analysis_results.values())
            summary_response = agent(f"Here are the analysis results:\n{all_insights}\n\n{summary_prompt}")
            st.session_state.summary = summary_response
        except Exception as e:
            st.session_state.summary = f"Error generating summary: {str(e)}"

# UI Elements
st.title("Data Insights Analyzer 📊")
st.markdown("""
This tool performs a comprehensive analysis of your dataset, examining reach, engagement, and conversion performance patterns.
""")

# File upload
uploaded_file = st.file_uploader("Upload your CSV file", type=["csv"])
if uploaded_file:
    try:
        with st.spinner('Loading data...'):
            # Save the uploaded file temporarily
            with tempfile.NamedTemporaryFile(delete=False) as tmp_file:
                tmp_file.write(uploaded_file.getvalue())
                data = load_data(tmp_file.name)
                st.session_state.df = data
    except Exception as e:
        st.error(f"Error loading data: {e}")
        st.stop()
else:
    st.warning('Awaiting CSV file upload.')
    st.stop()

# Let user select analysis category
st.session_state.selected_category = st.selectbox(
    "Select Analysis Category",
    ["Awareness & Reach", "Engagement & Interest", "Conversions & Action"]
)

# Initialize expanders in session state
if "expanders" not in st.session_state:
    st.session_state.expanders = {}

# Prepare questions based on selected category
QUESTIONS = CATEGORY_QUESTIONS[st.session_state.selected_category]

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

# Initialize agent after data is loaded
if st.session_state.df is not None and st.session_state.agent is None:
    st.session_state.agent = get_agent(st.session_state.df)

# Start Analysis button
if not st.session_state.analysis_started:
    if st.button("Start Analysis", type="primary"):
        st.session_state.analysis_started = True
        run_analysis(QUESTIONS, st.session_state.agent)

# Display summary if analysis is complete
if st.session_state.summary:
    st.markdown("---")
    st.markdown("### 🎯 Key Insights & Recommendations")
    st.markdown(st.session_state.summary)

# Add data preview section
with st.expander("Preview Dataset", expanded=False):
    st.dataframe(st.session_state.df.head())