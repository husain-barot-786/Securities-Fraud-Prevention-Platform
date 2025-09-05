from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_all_announcements():
    response = client.get("/announcements/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 2  # We have 2 default announcements

def test_get_verified_announcements():
    response = client.get("/announcements/?verified=true")
    assert response.status_code == 200
    data = response.json()
    assert all(announcement["verified"] is True for announcement in data)

def test_get_announcement_by_id():
    response = client.get("/announcements/1")
    assert response.status_code == 200
    data = response.json()
    assert data["company_name"] == "Alpha Corp"

def test_get_announcement_by_id_not_found():
    response = client.get("/announcements/9999")
    assert response.status_code == 404

def test_get_company_announcements():
    response = client.get("/announcements/company/Alpha")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert "Alpha" in data[0]["company_name"]

def test_add_new_announcement():
    new_announcement = {
        "id": 10,
        "company_name": "Test Corp",
        "headline": "Test announcement",
        "announcement_date": "2025-08-16",
        "verified": False
    }
    response = client.post("/announcements/", json=new_announcement)
    assert response.status_code == 200
    data = response.json()
    assert data["company_name"] == "Test Corp"
