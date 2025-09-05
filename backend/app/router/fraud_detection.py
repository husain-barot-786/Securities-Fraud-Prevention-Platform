from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(
    prefix="/fraud",
    tags=["Fraud Detection"]
)

class FraudTipBase(BaseModel):
    platform: str
    message: str

class FraudTip(FraudTipBase):
    id: int
    flagged: bool

# Simulated database
FAKE_FRAUD_TIPS: List[FraudTip] = [
    FraudTip(id=1, platform="Telegram", message="Guaranteed 50% in 1 week! Join now.", flagged=True),
    FraudTip(id=2, platform="WhatsApp", message="Get IPO allotment assured. Pay via GPay.", flagged=True),
    FraudTip(id=3, platform="Twitter", message="Adviser JohnDoe123 is SEBI-verified. DM for secret plans.", flagged=False)
]

@router.get("/tips/", response_model=List[FraudTip])
def get_fraud_tips(flagged: Optional[bool] = Query(None)):
    if flagged is None:
        return FAKE_FRAUD_TIPS
    return [tip for tip in FAKE_FRAUD_TIPS if tip.flagged == flagged]

@router.get("/tips/{tip_id}", response_model=FraudTip)
def get_fraud_tip_by_id(tip_id: int):
    for tip in FAKE_FRAUD_TIPS:
        if tip.id == tip_id:
            return tip
    raise HTTPException(status_code=404, detail="Fraud tip not found")

@router.post("/tips/", response_model=FraudTip)
def add_fraud_tip(tip: FraudTipBase):
    # Mark demo tips for clarity 
    is_demo = tip.platform.strip().lower() == "demo"
    new_id = max((t.id for t in FAKE_FRAUD_TIPS), default=0) + 1
    new_tip = FraudTip(
        id=new_id,
        platform=tip.platform.strip(),
        message=tip.message.strip(),
        flagged=False if not is_demo else False  # Could be True if you want
    )
    FAKE_FRAUD_TIPS.append(new_tip)
    return new_tip
