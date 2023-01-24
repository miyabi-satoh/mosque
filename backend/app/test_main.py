from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine

from app.main import app
from app.db.session import get_db  #


def test_create_hero():
    # Some code here omitted, we will see it later 👈
    client = TestClient(app)  #

    params = {"url": "/"}
    response = client.get(  #
        "/api/v1/pages", params=params
    )
    # Some code here omitted, we will see it later 👈
    data = response.json()  #

    assert response.status_code == 200  #
    assert data["name"] == "Deadpond"  #
    assert data["secret_name"] == "Dive Wilson"  #
    assert data["age"] is None  #
    assert data["id"] is not None  #

# Code below omitted 👇
