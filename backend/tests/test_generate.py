import pytest
from app import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_valid_idea(client):
    response = client.post("/generate", json={"idea": "I want to build Netflix"})
    assert response.status_code == 200
    assert response.get_json()["received_idea"] == "I want to build Netflix"


def test_missing_idea_key(client):
    response = client.post("/generate", json={})
    assert response.status_code == 400


def test_empty_idea(client):
    response = client.post("/generate", json={"idea": "   "})
    assert response.status_code == 400


def test_no_json_body(client):
    response = client.post("/generate")
    assert response.status_code == 400