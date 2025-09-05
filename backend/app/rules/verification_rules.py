from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(
    prefix="/verification-rules",
    tags=["Verification Rules"]
)

class VerificationRule(BaseModel):
    id: int
    description: str
    check_type: str       # "advisor", "announcement"
    risky_pattern: str    # phrase to catch or condition

VERIFICATION_RULES: List[VerificationRule] = [
    VerificationRule(id=1, description="Advisor name mismatch", check_type="advisor", risky_pattern="not in registry"),
    VerificationRule(id=2, description="Announcement missing counterparty", check_type="announcement", risky_pattern="missing counterparty"),
    VerificationRule(id=3, description="Too rapid performance change", check_type="announcement", risky_pattern="unexpected profit jump")
]

@router.get("/", response_model=List[VerificationRule])
def get_verification_rules():
    return VERIFICATION_RULES

@router.post("/", response_model=VerificationRule)
def add_verification_rule(rule: VerificationRule):
    if any(r.id == rule.id for r in VERIFICATION_RULES):
        raise HTTPException(status_code=400, detail="Rule ID already exists.")
    VERIFICATION_RULES.append(rule)
    return rule

@router.post("/test/", response_model=dict)
def test_verification(
    check_type: str = Body(..., example="advisor"),
    input_text: str = Body(..., example="This advisor is not in registry")
):
    flagged_rules = []
    for rule in VERIFICATION_RULES:
        if rule.check_type == check_type and rule.risky_pattern.lower() in input_text.lower():
            flagged_rules.append(rule.description)
    if flagged_rules:
        return {"flagged": True, "reasons": flagged_rules}
    return {"flagged": False, "reasons": []}
