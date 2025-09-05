from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_list_all_users():
    response = client.get("/users/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert any(user["username"] for user in data)

def test_filter_active_users():
    response = client.get("/users/?status=active")
    assert response.status_code == 200
    data = response.json()
    assert all(user["status"] == "active" for user in data)

def test_get_user_by_id():
    response = client.get("/users/1")
    assert response.status_code == 200
    user = response.json()
    assert user["id"] == 1
    assert user["username"] == "johninvestor"

def test_get_user_by_id_not_found():
    response = client.get("/users/9999")
    assert response.status_code == 404

def test_register_user_success():
    new_user = {
        "id": 10,
        "username": "janedoe",
        "email": "jane@investor.com",
        "role": "investor",
        "status": "active"
    }
    response = client.post("/users/register/", json=new_user)
    assert response.status_code == 200
    user = response.json()
    assert user["username"] == "janedoe"

def test_register_user_duplicate_id_or_username():
    duplicate_user = {
        "id": 1,
        "username": "johninvestor",
        "email": "john2@investor.com",
        "role": "investor",
        "status": "active"
    }
    response = client.post("/users/register/", json=duplicate_user)
    assert response.status_code == 400

def test_login_success():
    login_data = {
        "username": "johninvestor",
        "email": "john@investor.com"
    }
    response = client.post("/users/login/", json=login_data)
    assert response.status_code == 200
    user = response.json()
    assert user["username"] == "johninvestor"

def test_login_invalid_credentials():
    invalid_login = {
        "username": "invaliduser",
        "email": "invalid@investor.com"
    }
    response = client.post("/users/login/", json=invalid_login)
    assert response.status_code == 401
