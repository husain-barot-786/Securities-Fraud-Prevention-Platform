from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


# Import ONLY the routers that define APIRouter instances
from app.router import (
    fraud_detection,
    fraud_rules,
    verification,
    announcements,
    alerts,
    user
)
# Only import scraper/notifier if they contain FastAPI routers!
# If they are utility modules (not routers), do NOT include their routers below.
# Comment out or remove the next two lines if scraper/notifier are NOT APIRouter files:
# from app.utils import scraper
# from app.utils import notifier

app = FastAPI()


# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include all main routers (APIRouter only, NO service or utils or duplicate routers!)
app.include_router(fraud_detection.router)
app.include_router(fraud_rules.router)
app.include_router(verification.router)
app.include_router(announcements.router)
app.include_router(alerts.router)
app.include_router(user.router)
# If scraper.py and notifier.py in utils/ define APIRouter() with endpoints, you can also:
# app.include_router(scraper.router)
# app.include_router(notifier.router)


@app.get("/")
def read_root():
    return {"message": "Securities Market Hackathon Fraud Prevention Server is running."}
