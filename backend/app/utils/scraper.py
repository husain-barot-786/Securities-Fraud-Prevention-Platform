from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from datetime import datetime

router = APIRouter(
    prefix="/scraper",
    tags=["Scraper Utility"]
)

class ScrapedData(BaseModel):
    id: int
    platform: str      # "Telegram", "WhatsApp", "Twitter"
    content: str
    timestamp: str     # ISO format: YYYY-MM-DD HH:MM:SS

# Simulated scraped data
SCRAPED_DB: List[ScrapedData] = [
    ScrapedData(id=1, platform="Telegram", content="Join this group for insider stock tips.", timestamp="2025-08-15 21:20:00"),
    ScrapedData(id=2, platform="WhatsApp", content="Hot IPO: Get instant returns", timestamp="2025-08-15 21:22:00")
]

@router.get("/", response_model=List[ScrapedData])
def get_scraped_data():
    return SCRAPED_DB

@router.post("/refresh/", response_model=List[ScrapedData])
def refresh_scraper():
    # Simulate a new data fetch
    new_id = len(SCRAPED_DB)+1
    new_scrape = ScrapedData(
        id=new_id,
        platform="Twitter",
        content=f"Pump and dump alert @{new_id}.",
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )
    SCRAPED_DB.append(new_scrape)
    return SCRAPED_DB

@router.get("/{data_id}", response_model=ScrapedData)
def get_scrape_by_id(data_id: int):
    for d in SCRAPED_DB:
        if d.id == data_id:
            return d
    raise HTTPException(status_code=404, detail="Scraped data not found")
