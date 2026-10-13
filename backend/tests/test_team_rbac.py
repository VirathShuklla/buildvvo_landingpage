"""RBAC and Team (sales user) tests for BuildVVO."""
import os
import time
import pytest
import requests
from pathlib import Path

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL")
if not BASE_URL:
    envfile = Path("/app/frontend/.env").read_text()
    for line in envfile.splitlines():
        if line.startswith("REACT_APP_BACKEND_URL="):
            BASE_URL = line.split("=", 1)[1].strip().strip('"')
BASE_URL = BASE_URL.rstrip("/")
API = f"{BASE_URL}/api"
ADMIN_USER = "buildvvo"
ADMIN_PASS = "buildvvo@2026"

SUFFIX = str(int(time.time()))[-6:]
SALES_USERNAME = f"test.sales{SUFFIX}"[:30]
SALES_PASSWORD = "SalesPass123!"
SALES_NEW_PASSWORD = "NewSalesPass456!"
SALES_NAME = "TEST Sales User"


@pytest.fixture(scope="module")
def admin_headers():
    r = requests.post(f"{API}/auth/login", json={"username": ADMIN_USER, "password": ADMIN_PASS}, timeout=15)
    assert r.status_code == 200, r.text
    return {"Authorization": f"Bearer {r.json()['token']}"}


@pytest.fixture(scope="module")
def admin_id(admin_headers):
    r = requests.get(f"{API}/auth/me", headers=admin_headers, timeout=10)
    assert r.status_code == 200
    return r.json()["id"]


@pytest.fixture(scope="module")
def sales_user(admin_headers):
    # Clean up pre-existing (unlikely due to suffix)
    r = requests.post(f"{API}/users",
                      json={"username": SALES_USERNAME, "name": SALES_NAME, "password": SALES_PASSWORD},
                      headers=admin_headers, timeout=10)
    assert r.status_code == 201, r.text
    data = r.json()
    assert data["role"] == "sales"
    assert data["active"] is True
    yield data
    # teardown
    requests.delete(f"{API}/users/{data['id']}", headers=admin_headers, timeout=10)


@pytest.fixture(scope="module")
def sales_headers(sales_user):
    r = requests.post(f"{API}/auth/login",
                      json={"username": SALES_USERNAME, "password": SALES_PASSWORD}, timeout=10)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["user"]["role"] == "sales"
    assert body["user"]["name"] == SALES_NAME
    return {"Authorization": f"Bearer {body['token']}"}


@pytest.fixture(scope="module")
def test_lead_id(admin_headers):
    payload = {
        "name": "TEST_RBACLead", "company": "RBACCo", "phone": "9999900001",
        "email": "test_rbac@example.com", "software_type": "ERP",
        "budget": "₹50K–₹1.5L", "timeline": "1-3 months",
        "description": "RBAC lead for sales testing.",
    }
    r = requests.post(f"{API}/leads", json=payload, timeout=10)
    assert r.status_code == 201
    lid = r.json()["id"]
    yield lid
    requests.delete(f"{API}/leads/{lid}", headers=admin_headers, timeout=10)


# ---------- User create validation ----------
def test_create_user_bad_username(admin_headers):
    r = requests.post(f"{API}/users",
                      json={"username": "AB", "name": "Short", "password": "longenough1"},
                      headers=admin_headers, timeout=10)
    assert r.status_code == 422


def test_create_user_short_password(admin_headers):
    r = requests.post(f"{API}/users",
                      json={"username": "test.good", "name": "Good Name", "password": "short"},
                      headers=admin_headers, timeout=10)
    assert r.status_code == 422


def test_create_user_duplicate(admin_headers, sales_user):
    r = requests.post(f"{API}/users",
                      json={"username": SALES_USERNAME, "name": "Dup", "password": "longpass123"},
                      headers=admin_headers, timeout=10)
    assert r.status_code == 409


def test_list_users_admin(admin_headers, sales_user):
    r = requests.get(f"{API}/users", headers=admin_headers, timeout=10)
    assert r.status_code == 200
    users = r.json()
    assert any(u["username"] == SALES_USERNAME for u in users)


# ---------- Sales RBAC ----------
def test_sales_can_list_leads(sales_headers):
    r = requests.get(f"{API}/leads", headers=sales_headers, timeout=10)
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_sales_can_patch_lead(sales_headers, test_lead_id):
    r = requests.patch(f"{API}/leads/{test_lead_id}",
                       json={"status": "Contacted"}, headers=sales_headers, timeout=10)
    assert r.status_code == 200
    assert r.json()["status"] == "Contacted"


def test_sales_can_add_note(sales_headers, test_lead_id):
    r = requests.post(f"{API}/leads/{test_lead_id}/notes",
                      json={"text": "sales note"}, headers=sales_headers, timeout=10)
    assert r.status_code == 200
    notes = r.json()["notes"]
    assert any(n["text"] == "sales note" and n["author"] == SALES_NAME for n in notes)


def test_sales_cannot_delete_lead(sales_headers, test_lead_id):
    r = requests.delete(f"{API}/leads/{test_lead_id}", headers=sales_headers, timeout=10)
    assert r.status_code == 403


def test_sales_cannot_access_stats(sales_headers):
    r = requests.get(f"{API}/stats", headers=sales_headers, timeout=10)
    assert r.status_code == 403


def test_sales_cannot_list_users(sales_headers):
    r = requests.get(f"{API}/users", headers=sales_headers, timeout=10)
    assert r.status_code == 403


def test_sales_cannot_create_user(sales_headers):
    r = requests.post(f"{API}/users",
                      json={"username": "test.hack", "name": "Hacker", "password": "longpass123"},
                      headers=sales_headers, timeout=10)
    assert r.status_code == 403


def test_sales_cannot_update_settings(sales_headers):
    r = requests.put(f"{API}/settings", json={
        "whatsapp_number": "919999999999", "phone": "+91 99999 99999",
        "email": "hello@buildvvo.com", "address": "India",
        "business_hours": "Mon – Sat, 10:00 AM – 7:00 PM IST",
    }, headers=sales_headers, timeout=10)
    assert r.status_code == 403


def test_sales_cannot_touch_admin_user(sales_headers, admin_id):
    # sales doesn't have users perm so 403 before 404
    r = requests.patch(f"{API}/users/{admin_id}",
                       json={"name": "pwned"}, headers=sales_headers, timeout=10)
    assert r.status_code == 403
    r = requests.delete(f"{API}/users/{admin_id}", headers=sales_headers, timeout=10)
    assert r.status_code == 403


def test_admin_cannot_delete_admin_via_users(admin_headers, admin_id):
    # endpoint should 404 since sales_user() filter requires role=sales
    r = requests.delete(f"{API}/users/{admin_id}", headers=admin_headers, timeout=10)
    assert r.status_code == 404
    r = requests.patch(f"{API}/users/{admin_id}", json={"name": "hack"}, headers=admin_headers, timeout=10)
    assert r.status_code == 404


# ---------- Reset password ----------
def test_admin_reset_sales_password(admin_headers, sales_user):
    r = requests.patch(f"{API}/users/{sales_user['id']}",
                       json={"password": SALES_NEW_PASSWORD},
                       headers=admin_headers, timeout=10)
    assert r.status_code == 200
    # old password fails
    r_old = requests.post(f"{API}/auth/login",
                          json={"username": SALES_USERNAME, "password": SALES_PASSWORD}, timeout=10)
    assert r_old.status_code == 401
    # new works
    r_new = requests.post(f"{API}/auth/login",
                          json={"username": SALES_USERNAME, "password": SALES_NEW_PASSWORD}, timeout=10)
    assert r_new.status_code == 200


# ---------- Disable user ----------
def test_disable_sales_login(admin_headers, sales_user):
    # get a fresh token first
    tok_resp = requests.post(f"{API}/auth/login",
                             json={"username": SALES_USERNAME, "password": SALES_NEW_PASSWORD}, timeout=10)
    assert tok_resp.status_code == 200
    tok = tok_resp.json()["token"]
    # disable
    r = requests.patch(f"{API}/users/{sales_user['id']}",
                       json={"active": False}, headers=admin_headers, timeout=10)
    assert r.status_code == 200
    assert r.json()["active"] is False
    # existing token now 401
    r_me = requests.get(f"{API}/auth/me", headers={"Authorization": f"Bearer {tok}"}, timeout=10)
    assert r_me.status_code == 401
    # new login fails
    r_login = requests.post(f"{API}/auth/login",
                            json={"username": SALES_USERNAME, "password": SALES_NEW_PASSWORD}, timeout=10)
    assert r_login.status_code == 401
    # re-enable for cleanup
    requests.patch(f"{API}/users/{sales_user['id']}",
                   json={"active": True}, headers=admin_headers, timeout=10)
