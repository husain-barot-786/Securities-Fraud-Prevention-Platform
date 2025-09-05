from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_list_verified_advisors():
    response = client.get("/verify/advisors/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0

def test_search_advisor_by_name():
    response = client.get("/verify/advisors/search/?name=Safe")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert "Safe Invest Co." in [a["name"] for a in data]

def test_lookup_nonexistent_advisor():
    response = client.get("/verify/advisors/INA999999999")
    assert response.status_code == 404
    assert "not found" in response.text
