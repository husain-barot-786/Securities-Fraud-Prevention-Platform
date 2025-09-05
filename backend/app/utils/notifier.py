from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

router = APIRouter(
    prefix="/notifier",
    tags=["Notifier Utility"]
)

class Notification(BaseModel):
    id: int
    recipient: str             # email address or phone number
    notif_type: str            # "email", "sms", "alert"
    subject: Optional[str]     # only for email
    message: str
    status: str                # "sent", "failed"
    timestamp: str

# Simulated log of sent notifications
NOTIFICATIONS: List[Notification] = []

@router.post("/send/", response_model=Notification)
def send_notification(
    recipient: str = Body(..., example="user@example.com"),
    notif_type: str = Body(..., example="email"),  # "email", "sms", "alert"
    message: str = Body(..., example="Test message"),
    subject: Optional[str] = Body(None, example="Your Alert")
):
    if notif_type not in ["email", "sms", "alert"]:
        raise HTTPException(status_code=400, detail="notif_type must be 'email', 'sms', or 'alert'")

    notif_id = len(NOTIFICATIONS) + 1
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    # Simulate successful delivery
    notif = Notification(
        id=notif_id,
        recipient=recipient,
        notif_type=notif_type,
        subject=subject,
        message=message,
        status="sent",
        timestamp=ts
    )
    NOTIFICATIONS.append(notif)
    return notif

@router.get("/logs/", response_model=List[Notification])
def get_notifications():
    return NOTIFICATIONS

@router.get("/logs/{notif_id}", response_model=Notification)
def get_notification_by_id(notif_id: int):
    for notif in NOTIFICATIONS:
        if notif.id == notif_id:
            return notif
    raise HTTPException(status_code=404, detail="Notification not found")
