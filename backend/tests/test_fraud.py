from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_all_fraud_tips():
    response = client.get("/fraud/tips/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert any("platform" in tip for tip in data)

def test_add_duplicate_fraud_tip():
    new_tip = {
        "id": 1,
        "platform": "Telegram",
        "message": "Duplicate tip test",
        "flagged": True
    }
    response = client.post("/fraud/tips/", json=new_tip)
    assert response.status_code == 400
    assert "already exists" in response.text

def test_get_fraud_tip_by_id_not_found():
    response = client.get("/fraud/tips/9999")
    assert response.status_code == 404
