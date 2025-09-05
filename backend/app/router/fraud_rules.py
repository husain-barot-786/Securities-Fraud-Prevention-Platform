from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(
    prefix="/fraud-rules",
    tags=["Fraud Rules"]
)

# Basic request model: platform + message
class VerificationRequest(BaseModel):
    platform: str
    message: str

# Response model: flag status and reason
class VerificationResponse(BaseModel):
    flagged: bool
    reason: str

# Simplistic fraud detection logic with keywords
FRAUD_KEYWORDS = [
    "guaranteed",
    "secret plans",
    "insider info",
    "quick profit",
    "ipo allotment",
    "pay me",
    "free gifts",
    "win big",
    "blockchain scam",
]

@router.post("/test/", response_model=VerificationResponse)
def test_message(data: VerificationRequest):
    lower_msg = data.message.lower()
    matches = [kw for kw in FRAUD_KEYWORDS if kw in lower_msg]
    if matches:
        return VerificationResponse(
            flagged=True,
            reason=f"Matched suspicious keywords: {', '.join(matches)}"
        )
    return VerificationResponse(
        flagged=False,
        reason="No suspicious patterns detected."
    )
