from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import os
import httpx
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Cafe AI Service")

class AnalyzeRequest(BaseModel):
    currentRevenue: float
    prevRevenue: float
    revenueGrowth: float
    topProducts: List[Dict[str, Any]]
    categoryContributions: List[Dict[str, Any]]
    topTables: List[Dict[str, Any]]
    peakHours: List[Dict[str, Any]]
    productDrops: List[Dict[str, Any]]

@app.post("/analyze")
async def analyze_cafe(req: AnalyzeRequest):
    # Format prompt
    top_products_str = "\n".join([f"  * {p.get('name')}: {p.get('qty')} sold, ${p.get('revenue'):.2f} revenue" for p in req.topProducts])
    cat_contrib_str = "\n".join([f"  * {c.get('name')}: ${c.get('revenue'):.2f} ({c.get('percentage')}%)" for c in req.categoryContributions])
    top_tables_str = "\n".join([f"  * {t.get('name')}: ${t.get('revenue'):.2f}" for t in req.topTables])
    peak_hours_str = "\n".join([f"  * {h.get('hour')}:00 - {h.get('hour')+1}:00 ({h.get('count')} orders)" for h in req.peakHours])
    drops_str = "\n".join([f"  * {d.get('name')}: -{d.get('dropPercentage')}% drop (from {d.get('prevQty')} to {d.get('currQty')})" for d in req.productDrops])

    prompt = f"""Analyze the following sales performance data for "Cafe POS" and provide 5-6 concise, actionable, bulleted insights and recommendations for the cafe owner.

Data Summary:
- Period: Last 7 Days (vs Prior 7 Days)
- Current Week Revenue: ${req.currentRevenue:.2f} ({"+" if req.revenueGrowth >= 0 else ""}{req.revenueGrowth:.1f}% growth)
- Top Products:
{top_products_str}
- Category Contributions:
{cat_contrib_str}
- Top Tables:
{top_tables_str}
- Peak Hours:
{peak_hours_str}
- Significant Drops in Sales Qty:
{drops_str}

Formatting Constraints:
- Return exactly 5-6 bullet points.
- Do not add any greeting, intro, or concluding remarks.
- Provide direct insights first (e.g. "Revenue increased X%", "Y contributes Z% of sales").
- Conclude with a solid recommendation based on the data."""

    gemini_key = os.getenv("GEMINI_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")

    if gemini_key:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json={
                    "contents": [{"parts": [{"text": prompt}]}]
                }, timeout=30.0)
                
                if response.status_code == 200:
                    res_json = response.json()
                    text = res_json.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                    if text:
                        insights = [line.strip() for line in text.split("\n") if line.strip().startswith(("*", "-", "1", "2", "3", "4", "5", "6"))]
                        return {"source": "gemini", "insights": insights}
        except Exception as e:
            print(f"Gemini API error: {e}")

    if openai_key:
        try:
            url = "https://api.openai.com/v1/chat/completions"
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {openai_key}"
            }
            async with httpx.AsyncClient() as client:
                response = await client.post(url, headers=headers, json={
                    "model": "gpt-4o-mini",
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.5
                }, timeout=30.0)
                
                if response.status_code == 200:
                    res_json = response.json()
                    text = res_json.get("choices", [{}])[0].get("message", {}).get("content", "")
                    if text:
                        insights = [line.strip() for line in text.split("\n") if line.strip().startswith(("*", "-", "1", "2", "3", "4", "5", "6"))]
                        return {"source": "openai", "insights": insights}
        except Exception as e:
            print(f"OpenAI API error: {e}")

    # Local fallback if no API keys or errors
    local_insights = []
    local_insights.append(f"- Revenue is ${req.currentRevenue:.2f} this week ({'+' if req.revenueGrowth >= 0 else ''}{req.revenueGrowth:.1f}% compared to last week).")
    
    if req.topProducts:
        local_insights.append(f"- {req.topProducts[0].get('name')} contributes ${req.topProducts[0].get('revenue'):.2f} to total sales.")
    else:
        local_insights.append("- No top product recorded.")

    if req.categoryContributions:
        local_insights.append(f"- {req.categoryContributions[0].get('name')} contributes {req.categoryContributions[0].get('percentage')}% of total sales.")

    if req.topTables:
        table_names = [t.get('name', '').replace('Table ', '') for t in req.topTables]
        local_insights.append(f"- Tables {' and '.join(table_names)} generate the highest revenue.")

    if req.peakHours:
        ph = req.peakHours[0]
        hour = ph.get('hour', 0)
        start_ampm = "PM" if hour >= 12 else "AM"
        end_ampm = "PM" if hour + 1 >= 12 else "AM"
        start_hour = hour % 12 if hour % 12 != 0 else 12
        end_hour = (hour + 1) % 12 if (hour + 1) % 12 != 0 else 12
        local_insights.append(f"- Sales peak between {start_hour} {start_ampm} and {end_hour} {end_ampm}.")

    if req.productDrops:
        drop = req.productDrops[0]
        local_insights.append(f"- {drop.get('name')} sales dropped {drop.get('dropPercentage')}% compared to last week.")

    recommend_cat = req.categoryContributions[-1].get('name') if req.categoryContributions else "beverages"
    local_insights.append(f"- Consider running a promotion on {recommend_cat} to boost sales.")

    return {
        "source": "local-analytics-fallback",
        "insights": local_insights
    }
