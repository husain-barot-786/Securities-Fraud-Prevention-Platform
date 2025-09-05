from typing import Optional
from sqlalchemy import Column, Integer, String, Boolean
from pydantic import BaseModel, Field
from app.db.database import Base

class FraudTip(Base):
    __tablename__ = "fraud_tips"
    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String, index=True)
    message = Column(String, index=True)
    flagged = Column(Boolean, default=False)

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    alert_type = Column(String, index=True)
    message = Column(String)
    timestamp = Column(String)
    status = Column(String, default="active")

class AlertBase(BaseModel):
    alert_type: str = Field(..., example="FraudTip")
    message: str
    timestamp: str = Field(..., example="2025-08-15 21:00:00")
    status: str = Field(..., example="active")

class AlertOut(AlertBase):
    id: int

    model_config = {
        "from_attributes": True
    }

class AlertIn(BaseModel):
    alert_type: str
    message: str
    status: Optional[str] = "active"

class FraudTipOut(BaseModel):
    id: int
    platform: str
    message: str
    flagged: bool

    model_config = {
        "from_attributes": True
    }
