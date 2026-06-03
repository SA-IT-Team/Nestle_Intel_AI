import os
import re
import json
import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import anthropic

load_dotenv()


def force_plain_text(text: str) -> str:
    """Strip every markdown artifact. Return only lines that look like real sentences."""
    lines = text.split('\n')
    kept = []
    for line in lines:
        s = line.strip()
        if not s:
            continue
        if s.startswith('|'):                          # table row
            continue
        if re.match(r'^[-|:\s]+$', s):               # table separator line
            continue
        if re.match(r'^#{1,6}\s', s):                # heading
            continue
        if re.match(r'^\s*\d+\.\s+\*\*', s):         # numbered bold heading like "1. **Title**"
            continue

        # Strip inline markdown from the line
        s = re.sub(r'\*\*(.+?)\*\*', r'\1', s)
        s = re.sub(r'\*(.+?)\*', r'\1', s)
        s = re.sub(r'`[^`]+`', '', s)
        s = re.sub(r'#{1,6}\s*', '', s)
        s = re.sub(r'^\s*[-*+>]\s*', '', s)
        s = re.sub(r'^\s*\d+\.\s*', '', s)
        s = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', s)
        s = re.sub(r'\|', ' ', s)
        s = re.sub(r'[^\x00-\xFF]', '', s)           # emojis / non-latin
        s = re.sub(r'\s+', ' ', s).strip()

        # Only keep lines that look like a real English sentence (contain a verb/noun pattern)
        # i.e., at least 30 chars of actual alpha content and ends with sentence punctuation
        alpha_len = len(re.sub(r'[^a-zA-Z ]', '', s))
        if alpha_len >= 25:
            kept.append(s)

    result = ' '.join(kept)
    result = re.sub(r'\s+', ' ', result).strip()
    return result


app = FastAPI(title="Nestle Research API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# ── Prompt each agent to end with a plain-English insight sentence ────────────
STAGE_PROMPTS = {
    "market": """You are a market research analyst. Analyze the protein coffee market opportunity for this product concept:

Product: {query}

Provide structured market intelligence including:
1. Global market size and CAGR for protein coffee/functional beverages
2. India-specific opportunity sizing (TAM, SAM, estimated SOM for Nestlé)
3. Key growth drivers (fitness culture, urbanization, health awareness)
4. Consumer segment breakdown (fitness enthusiasts, working professionals, Gen Z)
5. Market opportunity score (1-10) with reasoning

Be specific with numbers.

End your response with a section titled INSIGHT SUMMARY: followed by 2-3 plain sentences (no bullet points, no markdown, no tables) summarizing the key opportunity.""",

    "competitor": """You are a competitive intelligence analyst. Map the competitive landscape for this product:

Product: {query}

Analyze:
1. Top 8-10 global and India competitors in protein coffee/functional coffee
2. For each: protein content, price per serving, market presence, channels, rating
3. Key capability gaps vs Nestlé (brand, distribution, price, India presence)
4. White-space opportunities Nestlé can exploit
5. Nestlé's competitive advantages (NESCAFÉ brand, supply chain, distribution)

Name real brands (Slate Milk, Laird Superfood, Bulletproof, MuscleBlaze, OZiva, etc.).

End your response with a section titled INSIGHT SUMMARY: followed by 2-3 plain sentences (no bullet points, no markdown, no tables) summarizing Nestlé's competitive position.""",

    "consumer": """You are a consumer insights researcher. Analyze consumer sentiment for:

Product: {query}

Based on market research and consumer trends, provide:
1. Key consumer pain points with current protein supplements
2. Coffee consumption behavior in India (instant vs premium)
3. Unmet needs in the protein + coffee combination
4. Purchase barriers and motivators
5. Top 3 consumer personas with brief profiles

End your response with a section titled INSIGHT SUMMARY: followed by 2-3 plain sentences (no bullet points, no markdown, no tables) summarizing the consumer opportunity.""",

    "survey": """You are a survey research expert. Design and analyze consumer research for:

Product: {query}

Provide:
1. 8 targeted survey questions for this product concept
2. Simulated response data (realistic percentages) for key questions:
   - Purchase intent breakdown (definitely/likely/maybe/unlikely/no)
   - Preferred format (sachet/RTD can/cold brew/capsule)
   - Price sensitivity (less than Rs30 / Rs30-50 / Rs50-80 / more than Rs80)
   - Purchase channel preferences
3. Key survey findings and what they mean for product strategy

End your response with a section titled INSIGHT SUMMARY: followed by 2-3 plain sentences (no bullet points, no markdown, no tables) summarizing what the survey data means for launch strategy.""",

    "synthesis": """You are the lead research director. Synthesize all research findings:

Product: {query}

Research Summary:
{context}

Create a comprehensive synthesis covering:
1. Overall market verdict (Go/No-Go with reasoning)
2. Recommended product positioning
3. Go-to-market strategy (launch sequence, channels, pricing)
4. Target audience definition
5. Key risks and mitigation
6. Expected Year-1 revenue projection

Write as an executive briefing. Be decisive and specific.""",
}



class ResearchRequest(BaseModel):
    stage: str
    query: str
    context: dict = {}


class InsightRequest(BaseModel):
    researchData: dict = {}


async def stream_stage(stage: str, query: str, context: dict):
    prompt_template = STAGE_PROMPTS.get(stage, STAGE_PROMPTS["market"])

    context_str = ""
    if context:
        for k, v in context.items():
            if isinstance(v, dict) and "insight" in v:
                context_str += f"\n{k.upper()}: {v['insight']}\n"

    prompt = prompt_template.format(query=query, context=context_str)

    stage_labels = {
        "market": "Market Scoping",
        "competitor": "Competitor Intelligence",
        "consumer": "Consumer Research",
        "survey": "Survey Design",
        "synthesis": "Synthesis",
    }
    label = stage_labels.get(stage, stage)

    logs = [
        f"[{label}] Initializing agent...",
        f"[{label}] Analyzing product concept...",
        f"[{label}] Querying knowledge base...",
        f"[{label}] Processing data signals...",
        f"[{label}] Structuring findings...",
    ]

    for log in logs:
        yield f"data: {json.dumps({'type': 'log', 'message': log})}\n\n"
        await asyncio.sleep(0.2)

    full_text = ""
    with client.messages.stream(
        model="claude-sonnet-4-6",
        max_tokens=1500,
        messages=[{"role": "user", "content": prompt}],
    ) as stream:
        for text in stream.text_stream:
            full_text += text
            if len(text.strip()) > 3:
                yield f"data: {json.dumps({'type': 'log', 'message': f'[{label}] → {text.strip()[:70]}'})}\n\n"
            await asyncio.sleep(0)

    # ── Dedicated summarisation call — plain prose ────────────────────────────
    yield f"data: {json.dumps({'type': 'log', 'message': f'[{label}] Generating dashboard summary...'})}\n\n"

    SUMMARY_PROMPTS = {
        "market": (
            "Based on the research above, write a 3-sentence plain English paragraph for a business dashboard card. "
            "Sentence 1: state the market size and growth rate in India. "
            "Sentence 2: describe the primary consumer segments. "
            "Sentence 3: state why this is a strong opportunity for Nestle."
        ),
        "competitor": (
            "Based on the research above, write a 3-sentence plain English paragraph for a business dashboard card. "
            "Sentence 1: name the top 2-3 competitors and their main weakness. "
            "Sentence 2: describe the key market gap that exists. "
            "Sentence 3: explain Nestle's specific competitive advantage."
        ),
        "consumer": (
            "Based on the research above, write a 3-sentence plain English paragraph for a business dashboard card. "
            "Sentence 1: describe the primary target consumer and their key need. "
            "Sentence 2: state the main pain point with current alternatives. "
            "Sentence 3: describe what would motivate them to buy this product."
        ),
        "survey": (
            "Based on the research above, write a 3-sentence plain English paragraph for a business dashboard card. "
            "Sentence 1: state the overall purchase intent percentage and what it means. "
            "Sentence 2: state the most preferred product format and price range. "
            "Sentence 3: state the most important channel preference and what it means for go-to-market."
        ),
        "synthesis": (
            "Based on the research above, write a 3-sentence plain English paragraph for a business dashboard card. "
            "Sentence 1: give a clear Go or No-Go verdict with one supporting reason. "
            "Sentence 2: state the recommended product and price point. "
            "Sentence 3: state the most important reason to launch now rather than later."
        ),
    }
    summary_prompt = SUMMARY_PROMPTS.get(stage, "Write a 3-sentence plain English summary of the key business insight.")

    # Pre-clean the research context before sending to Haiku
    # so it never sees tables, bullets, or pipe-formatted data
    clean_context = force_plain_text(full_text)[:1800]

    summary_resp = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=220,
        system=(
            "You are a business analyst writing insight cards for an executive dashboard. "
            "Your job is to read research notes and write a FRESH 3-sentence summary IN YOUR OWN WORDS. "
            "Rules: plain English sentences only. No copying from the research. No markdown. "
            "No asterisks, pipes, dashes, bullets, numbers, or symbols of any kind. "
            "No headings. Just three clean, complete sentences in a single paragraph."
        ),
        messages=[{
            "role": "user",
            "content": (
                f"Research notes:\n{clean_context}\n\n"
                f"Task: {summary_prompt}\n\n"
                "Remember: write your answer in your own words as 3 plain sentences. "
                "Do not copy or repeat anything from the research notes above."
            ),
        }],
    )
    raw_insight = summary_resp.content[0].text.strip()

    # Hard-clean whatever Haiku returns
    insight = force_plain_text(raw_insight)

    result = {"raw": full_text, "insight": insight}
    yield f"data: {json.dumps({'type': 'result', 'data': result})}\n\n"
    yield f"data: {json.dumps({'type': 'done'})}\n\n"


@app.post("/api/research/stream")
async def research_stream(req: ResearchRequest):
    return StreamingResponse(
        stream_stage(req.stage, req.query, req.context),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


async def stream_insight(research_data: dict):
    context_parts = []
    for key in ["market", "competitor", "consumer", "survey"]:
        if key in research_data and isinstance(research_data[key], dict):
            raw = research_data[key].get("raw", research_data[key].get("insight", ""))
            context_parts.append(f"=== {key.upper()} RESEARCH ===\n{raw[:800]}")

    context_str = "\n\n".join(context_parts) if context_parts else \
        "No prior research data. Use your knowledge about the protein coffee market in India."

    prompt = f"""You are a senior strategy consultant. Synthesize the following research into a crisp executive briefing for Nestlé's leadership team.

{context_str}

Write a 400-500 word executive synthesis. Use these exact bold section headers on their own line:
**Market Verdict**
**Competitive Moat**
**Consumer Signal**
**Recommended Launch**
**Time-to-Market Advantage**

Write in plain executive prose under each header. No bullet points, no tables, no markdown except the bold section headers."""

    with client.messages.stream(
        model="claude-sonnet-4-6",
        max_tokens=900,
        messages=[{"role": "user", "content": prompt}],
    ) as stream:
        for text in stream.text_stream:
            yield f"data: {json.dumps({'type': 'text', 'text': text})}\n\n"

    yield f"data: {json.dumps({'type': 'done'})}\n\n"


@app.post("/api/research/insight")
async def generate_insight(req: InsightRequest):
    return StreamingResponse(
        stream_insight(req.researchData),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@app.get("/api/health")
async def health():
    return {"status": "ok", "model": "claude-sonnet-4-6"}
