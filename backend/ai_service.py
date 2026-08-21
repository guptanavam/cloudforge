import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

client = genai.Client()

def build_prompt(idea, expected_users=None):
    if expected_users:
        scale_instruction = (
            f"The user expects approximately {expected_users} users. "
            f"Design one architecture specifically for this scale. "
            f"Return exactly ONE item in 'architecture_options'."
        )
    else:
        scale_instruction = (
            "The user did not specify expected scale. "
            "Generate THREE tiered options in 'architecture_options': "
            "one for a small/startup scale (hundreds of users), "
            "one for a medium scale (tens of thousands of users), "
            "and one for a large scale (millions of users)."
        )

    return f"""
You are a cloud architecture assistant. Based on the user's app idea below,
suggest cloud architecture options.

App idea: "{idea}"
{scale_instruction}

Respond ONLY with valid JSON in this exact shape, nothing else:
{{
  "summary": "one sentence overview of the app idea",
  "architecture_options": [
    {{
      "tier_name": "string, e.g. Startup/MVP",
      "suggested_database": "string",
      "key_aws_services": ["string", "string"],
      "estimated_monthly_cost_usd": "string, e.g. '$50-100'",
      "notes": "one sentence caveat specific to this tier"
    }}
  ],
  "cost_disclaimer": "a caution that these are rough estimates, not guaranteed pricing, and to verify with the AWS Pricing Calculator"
}}
"""

def generate_architecture(idea, expected_users=None):
    prompt = build_prompt(idea, expected_users)

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json"
        )
    )

    return json.loads(response.text)