from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(
    prefix="/fraud-rules",
    tags=["Fraud Rules"]
)

class FraudRule(BaseModel):
    id: int
    description: str
    keyword: str
    platform: Optional[str]  # "Telegram", "WhatsApp", "Twitter", or None for all platforms

# In-memory store for rules
RULES: List[FraudRule] = [
    FraudRule(id=1, description="Guaranteed % returns offers", keyword="guaranteed", platform=None),
    FraudRule(id=2, description="Assured IPO allotment", keyword="IPO allotment", platform=None),
    FraudRule(id=3, description="DM for stock tips", keyword="DM for", platform="Twitter")
]

@router.get("/", response_model=List[FraudRule])
def list_rules():
    return RULES

@router.post("/", response_model=FraudRule)
def add_rule(rule: FraudRule):
    if any(r.id == rule.id for r in RULES):
        raise HTTPException(status_code=400, detail="Rule ID already exists.")
    RULES.append(rule)
    return rule

@router.post("/test/", response_model=dict)
def test_against_rules(
    platform: str = Body(..., example="Telegram"),
    message: str = Body(..., example="Guaranteed 50% return in one week!")
):
    flagged_rules = []
    for rule in RULES:
        if rule.keyword.lower() in message.lower():
            # platform match or rule platform is None (all)
            if not rule.platform or rule.platform.lower() == platform.lower():
                flagged_rules.append(rule.description)
    if flagged_rules:
        return {"flagged": True, "reasons": flagged_rules}
    return {"flagged": False, "reasons": []}
