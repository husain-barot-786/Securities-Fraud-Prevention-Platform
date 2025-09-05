from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(
    prefix="/announcements",
    tags=["Corporate Announcements"]
)

class Announcement(BaseModel):
    id: int
    company_name: str
    headline: str
    announcement_date: str  # ISO format: YYYY-MM-DD
    verified: bool

# Simulated official announcements database
ANNOUNCEMENTS_DB: List[Announcement] = [
    Announcement(id=1, company_name="Alpha Corp", headline="Quarterly profits up 10%", announcement_date="2025-08-11", verified=True),
    Announcement(id=2, company_name="Beta Ltd", headline="Merger with Gamma PLC", announcement_date="2025-08-13", verified=True)
]

@router.get("/", response_model=List[Announcement])
def get_announcements(verified: Optional[bool] = Query(None, description="Only verified if true")):
    if verified is None:
        return ANNOUNCEMENTS_DB
    return [a for a in ANNOUNCEMENTS_DB if a.verified == verified]

@router.get("/{ann_id}", response_model=Announcement)
def get_announcement_by_id(ann_id: int):
    for a in ANNOUNCEMENTS_DB:
        if a.id == ann_id:
            return a
    raise HTTPException(status_code=404, detail="Announcement ID not found")

@router.post("/", response_model=Announcement)
def add_announcement(announcement: Announcement):
    if any(a.id == announcement.id for a in ANNOUNCEMENTS_DB):
        raise HTTPException(status_code=400, detail="Announcement ID already exists")
    ANNOUNCEMENTS_DB.append(announcement)
    return announcement

@router.get("/company/{company_name}", response_model=List[Announcement])
def get_company_announcements(company_name: str):
    filtered = [a for a in ANNOUNCEMENTS_DB if company_name.lower() in a.company_name.lower()]
    if not filtered:
        raise HTTPException(status_code=404, detail=f"No announcements found for {company_name}")
    return filtered
