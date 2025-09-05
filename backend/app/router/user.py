from fastapi import APIRouter, HTTPException, Query, Body
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(
    prefix="/users",
    tags=["User Management"]
)

class User(BaseModel):
    id: int
    username: str
    email: str
    role: str    # "investor", "regulator", "admin"
    status: str  # "active", "inactive"

# Simulated user database
USERS_DB: List[User] = [
    User(id=1, username="johninvestor", email="john@investor.com", role="investor", status="active"),
    User(id=2, username="regulasebi", email="r.sebi@sebi.in", role="regulator", status="active"),
    User(id=3, username="adminhack", email="admin@hackathon.com", role="admin", status="active")
]

@router.get("/", response_model=List[User])
def list_users(status: Optional[str] = Query(None, description="Filter by status: active|inactive")):
    if status is None:
        return USERS_DB
    return [u for u in USERS_DB if u.status == status.lower()]

@router.post("/register/", response_model=User)
def register_user(user: User = Body(...)):
    if any(u.id == user.id or u.username == user.username for u in USERS_DB):
        raise HTTPException(status_code=400, detail="User ID or username already exists")
    USERS_DB.append(user)
    return user

@router.get("/{user_id}", response_model=User)
def get_user_by_id(user_id: int):
    for u in USERS_DB:
        if u.id == user_id:
            return u
    raise HTTPException(status_code=404, detail="User not found")

@router.post("/login/", response_model=User)
def login_user(username: str = Body(...), email: str = Body(...)):
    for u in USERS_DB:
        if u.username == username and u.email == email:
            return u
    raise HTTPException(status_code=401, detail="Invalid username or email")
