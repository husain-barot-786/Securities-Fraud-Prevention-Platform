from fastapi import APIRouter, HTTPException, Query, WebSocket, WebSocketDisconnect, Depends, status
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.schemas import Alert as AlertORM, AlertOut, AlertIn
import json
from datetime import datetime
import asyncio
from app.utils.ws_manager import manager

router = APIRouter(
    prefix="/alerts",
    tags=["Fraud Alerts"]
)

class AlertIn(BaseModel):
    alert_type: str
    message: str
    status: Optional[str] = "active"

@router.get("/", response_model=List[AlertOut])
def get_alerts(status: Optional[str] = Query(None, description="Filter by status: active|resolved"), db: Session = Depends(get_db)):
    if status is None:
        alerts = db.query(AlertORM).order_by(AlertORM.timestamp.desc()).all()
        return alerts
    filtered = db.query(AlertORM).filter(AlertORM.status == status.lower()).order_by(AlertORM.timestamp.desc()).all()
    return filtered

@router.get("/{alert_id}", response_model=AlertOut)
def get_alert_by_id(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(AlertORM).filter(AlertORM.id == alert_id).first()
    if alert:
        return alert
    raise HTTPException(status_code=404, detail="Alert not found")

@router.post("/", response_model=AlertOut, status_code=status.HTTP_201_CREATED)
async def add_alert(
    alert: AlertIn,
    db: Session = Depends(get_db),
):
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    new_alert = AlertORM(
        alert_type=alert.alert_type,
        message=alert.message,
        timestamp=now,
        status=alert.status
    )
    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)
    alert_json = json.dumps(AlertOut.model_validate(new_alert).model_dump())
    await manager.broadcast(alert_json)
    return new_alert

@router.patch("/{alert_id}/resolve", response_model=AlertOut)
def resolve_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(AlertORM).filter(AlertORM.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.status = "resolved"
    db.commit()
    db.refresh(alert)
    return alert

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await asyncio.sleep(10)  # keep connection alive
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@router.get("/type/{alert_type}", response_model=List[AlertOut])
def get_alerts_by_type(alert_type: str, db: Session = Depends(get_db)):
    filtered = db.query(AlertORM).filter(AlertORM.alert_type.ilike(alert_type)).order_by(AlertORM.timestamp.desc()).all()
    if not filtered:
        raise HTTPException(status_code=404, detail=f"No alerts found for type: {alert_type}")
    return filtered
