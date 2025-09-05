from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_all_alerts():
    response = client.get("/alerts/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_get_active_alerts():
    response = client.get("/alerts/?status=active")
    assert response.status_code == 200
    data = response.json()
    assert all(alert["status"] == "active" for alert in data)

def test_get_alert_by_id():
    response = client.get("/alerts/1")
    assert response.status_code == 200
    data = response.json()
    assert data["alert_type"] == "FraudTip"

def test_get_alert_by_id_not_found():
    response = client.get("/alerts/9999")
    assert response.status_code == 404

def test_get_alerts_by_type():
    response = client.get("/alerts/type/FraudTip")
    assert response.status_code == 200
    data = response.json()
    assert all(alert["alert_type"] == "FraudTip" for alert in data)

def test_add_new_alert():
    new_alert = {
        "id": 10,
        "alert_type": "TestAlert",
        "message": "Test alert message",
        "timestamp": "2025-08-16 20:00:00",
        "status": "active"
    }
    response = client.post("/alerts/", json=new_alert)
    assert response.status_code == 200
    data = response.json()
    assert data["alert_type"] == "TestAlert"
