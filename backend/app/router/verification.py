from fastapi import APIRouter, HTTPException, Query, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from typing import List, Optional
import json
from datetime import datetime

from app.utils.ws_manager import manager  # Shared WebSocket manager for broadcasting

router = APIRouter(
    prefix="/verification",
    tags=["User Verification"]
)

# Mock SEBI registry
SEBI_ADVISORS = [
    {"reg_id": "INA123456789", "name": "Genuine Advisor LLP", "entity_type": "Individual"},
    {"reg_id": "INA987654321", "name": "Safe Invest Co.", "entity_type": "Corporate"},
    {"reg_id": "INA555555555", "name": "True Research Pvt Ltd", "entity_type": "Corporate"}
]

class Advisor(BaseModel):
    reg_id: str
    name: str
    entity_type: str

@router.get("/advisors/", response_model=List[Advisor])
def list_verified_advisors():
    return SEBI_ADVISORS

@router.get("/advisors/search/", response_model=List[Advisor])
def search_advisor(name: Optional[str] = Query(None, description="Advisor name to search")):
    if not name:
        return SEBI_ADVISORS
    results = [advisor for advisor in SEBI_ADVISORS if name.lower() in advisor["name"].lower()]
    if not results:
        raise HTTPException(status_code=404, detail=f"No advisor found for '{name}'")
    return results

@router.get("/advisors/{reg_id}", response_model=Advisor)
def get_advisor_by_reg_id(reg_id: str):
    for advisor in SEBI_ADVISORS:
        if advisor["reg_id"].upper() == reg_id.upper():
            return advisor
    raise HTTPException(status_code=404, detail="Advisor registration ID not found")


class VerificationStatus(BaseModel):
    user_id: int
    username: str
    status: str   # e.g., "pending", "approved", "rejected"
    timestamp: str = None  # ISO datetime string, set in backend

VERIFICATION_UPDATES: List[VerificationStatus] = []

@router.get("/status-updates/", response_model=List[VerificationStatus])
def get_status_updates():
    return VERIFICATION_UPDATES

@router.post("/status-update")
async def verification_status_update(status_update: VerificationStatus):
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    status_update.timestamp = now
    VERIFICATION_UPDATES.append(status_update)
    msg_json = json.dumps(status_update.dict())
    await manager.broadcast(msg_json)
    return {"message": "Verification status broadcasted", "status_update": status_update}

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_personal_message(f"You wrote: {data}", websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
