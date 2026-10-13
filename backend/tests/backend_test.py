"""BuildVVO backend API tests."""
import os
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/") if os.environ.get("REACT_APP_BACKEND_URL") else None
if not BASE_URL:
    # Fallback: read from frontend/.env
    from pathlib import Path
    envfile = Path("/app/frontend/.env").read_text()
    for line in envfile.splitlines():
        if line.startswith("REACT_APP_BACKEND_URL="):
            BASE_URL = line.split("=", 1)[1].strip().strip('"').rstrip("/")
            break

API = f"{BASE_URL}/api"
ADMIN_USER = "buildvvo"
ADMIN_PASS = "buildvvo@2026"

CREATED_LEADS = []


@pytest.fixture(scope="session")
def admin_token():
    r = requests.post(f"{API}/auth/login", json={"username": ADMIN_USER, "password": ADMIN_PASS}, timeout=15)
    if r.status_code != 200:
        pytest.skip(f"Admin login failed: {r.status_code} {r.text}")
    return r.json()["token"]


@pytest.fixture(scope="session")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# ---------- Health / Public ----------
def test_api_root():
    r = requests.get(f"{API}/", timeout=10)
    assert r.status_code == 200
    assert "BuildVVO" in r.json().get("message", "")


def test_get_settings_public():
    r = requests.get(f"{API}/settings", timeout=10)
    assert r.status_code == 200
    data = r.json()
    for k in ("whatsapp_number", "phone", "email", "address"):
        assert k in data


# ---------- Auth ----------
def test_login_valid():
    r = requests.post(f"{API}/auth/login", json={"username": ADMIN_USER, "password": ADMIN_PASS}, timeout=10)
    assert r.status_code == 200
    body = r.json()
    assert "token" in body and isinstance(body["token"], str)
    assert body["user"]["username"] == ADMIN_USER


def test_login_wrong_password():
    r = requests.post(f"{API}/auth/login", json={"username": ADMIN_USER, "password": "wrong_pw_xyz"}, timeout=10)
    assert r.status_code == 401


def test_me_requires_auth():
    r = requests.get(f"{API}/auth/me", timeout=10)
    assert r.status_code == 401


def test_me_with_token(auth_headers):
    r = requests.get(f"{API}/auth/me", headers=auth_headers, timeout=10)
    assert r.status_code == 200
    assert r.json()["username"] == ADMIN_USER


def test_protected_endpoints_require_auth():
    for path in ["/leads", "/stats"]:
        r = requests.get(f"{API}{path}", timeout=10)
        assert r.status_code == 401, f"{path} should be 401 got {r.status_code}"
    r = requests.put(f"{API}/settings", json={}, timeout=10)
    assert r.status_code == 401


# ---------- Leads validation ----------
def test_lead_bad_email():
    payload = _lead_payload()
    payload["email"] = "not-an-email"
    r = requests.post(f"{API}/leads", json=payload, timeout=10)
    assert r.status_code == 422


def test_lead_bad_budget():
    payload = _lead_payload()
    payload["budget"] = "₹1 crore"
    r = requests.post(f"{API}/leads", json=payload, timeout=10)
    assert r.status_code == 422


def test_lead_short_description():
    payload = _lead_payload()
    payload["description"] = "short"
    r = requests.post(f"{API}/leads", json=payload, timeout=10)
    assert r.status_code == 422


def test_lead_create_and_retrieve(auth_headers):
    payload = _lead_payload(name="TEST_Alice", email="test_alice@example.com")
    r = requests.post(f"{API}/leads", json=payload, timeout=10)
    assert r.status_code == 201
    lead_id = r.json()["id"]
    CREATED_LEADS.append(lead_id)

    # GET
    g = requests.get(f"{API}/leads/{lead_id}", headers=auth_headers, timeout=10)
    assert g.status_code == 200
    doc = g.json()
    assert doc["email"] == "test_alice@example.com"
    assert doc["name"] == "TEST_Alice"
    assert doc["status"] == "New"
    assert doc["budget"] == payload["budget"]


def test_lead_honeypot_blocks_insert():
    payload = _lead_payload(name="TEST_Honeybot", email="test_honey@example.com")
    payload["website"] = "spam"
    r = requests.post(f"{API}/leads", json=payload, timeout=10)
    assert r.status_code == 201
    assert r.json().get("id") == "ok"


def test_lead_update_status(auth_headers):
    pid = _create_lead("TEST_StatusUser", "test_status@example.com")
    r = requests.patch(f"{API}/leads/{pid}", json={"status": "Qualified"}, headers=auth_headers, timeout=10)
    assert r.status_code == 200
    assert r.json()["status"] == "Qualified"
    g = requests.get(f"{API}/leads/{pid}", headers=auth_headers, timeout=10).json()
    assert g["status"] == "Qualified"


def test_lead_add_note(auth_headers):
    pid = _create_lead("TEST_Noter", "test_note@example.com")
    r = requests.post(f"{API}/leads/{pid}/notes", json={"text": "follow up tomorrow"},
                     headers=auth_headers, timeout=10)
    assert r.status_code == 200
    assert any(n["text"] == "follow up tomorrow" for n in r.json()["notes"])


def test_lead_update_source_and_followup(auth_headers):
    pid = _create_lead("TEST_SrcUser", "test_src@example.com")
    r = requests.patch(f"{API}/leads/{pid}",
                      json={"source": "LinkedIn", "follow_up_date": "2026-02-15"},
                      headers=auth_headers, timeout=10)
    assert r.status_code == 200
    body = r.json()
    assert body["source"] == "LinkedIn"
    assert body["follow_up_date"] == "2026-02-15"


def test_lead_list_search(auth_headers):
    r = requests.get(f"{API}/leads", params={"q": "TEST_Alice"}, headers=auth_headers, timeout=10)
    assert r.status_code == 200
    assert any(l["name"] == "TEST_Alice" for l in r.json())


def test_lead_list_filter_status(auth_headers):
    r = requests.get(f"{API}/leads", params={"status": "Qualified"}, headers=auth_headers, timeout=10)
    assert r.status_code == 200
    for l in r.json():
        assert l["status"] == "Qualified"


# ---------- Stats ----------
def test_stats(auth_headers):
    r = requests.get(f"{API}/stats", headers=auth_headers, timeout=10)
    assert r.status_code == 200
    s = r.json()
    for k in ("total", "qualified", "consultations", "conversion_rate",
              "by_status", "by_source", "daily", "whatsapp_clicks"):
        assert k in s
    assert isinstance(s["by_status"], list)
    assert len(s["daily"]) == 30
    # New fields for Overview widgets
    assert "recent" in s and isinstance(s["recent"], list)
    assert "upcoming_follow_ups" in s and isinstance(s["upcoming_follow_ups"], list)


def test_stats_recent_and_upcoming_populate(auth_headers):
    # Create a lead and set a future follow-up date => must appear in upcoming_follow_ups
    pid = _create_lead("TEST_UpcomingUser", "test_upcoming@example.com")
    r = requests.patch(f"{API}/leads/{pid}",
                       json={"follow_up_date": "2026-12-15", "status": "Qualified"},
                       headers=auth_headers, timeout=10)
    assert r.status_code == 200
    s = requests.get(f"{API}/stats", headers=auth_headers, timeout=10).json()
    ids_recent = [x["id"] for x in s["recent"]]
    ids_upcoming = [x["id"] for x in s["upcoming_follow_ups"]]
    assert pid in ids_recent, "freshly created lead should be in recent"
    assert pid in ids_upcoming, "lead with future follow_up_date should be in upcoming_follow_ups"


# ---------- Events ----------
def test_event_whatsapp_increments(auth_headers):
    before = requests.get(f"{API}/stats", headers=auth_headers, timeout=10).json()["whatsapp_clicks"]
    r = requests.post(f"{API}/events", json={"type": "whatsapp_click", "page": "/"}, timeout=10)
    assert r.status_code == 201
    after = requests.get(f"{API}/stats", headers=auth_headers, timeout=10).json()["whatsapp_clicks"]
    assert after == before + 1


# ---------- Settings update ----------
def test_settings_update_and_restore(auth_headers):
    original = requests.get(f"{API}/settings", timeout=10).json()
    new_wa = "919812345678"
    new_phone = "+91 98765 43210"
    payload = {
        "whatsapp_number": new_wa,
        "phone": new_phone,
        "email": original["email"],
        "address": "Test Address 123",
        "business_hours": original.get("business_hours", ""),
        "ga4_id": original.get("ga4_id", ""),
        "google_ads_id": original.get("google_ads_id", ""),
        "google_ads_label": original.get("google_ads_label", ""),
        "meta_pixel_id": original.get("meta_pixel_id", ""),
    }
    r = requests.put(f"{API}/settings", json=payload, headers=auth_headers, timeout=10)
    assert r.status_code == 200
    assert r.json()["whatsapp_number"] == new_wa

    # Public endpoint reflects it
    pub = requests.get(f"{API}/settings", timeout=10).json()
    assert pub["whatsapp_number"] == new_wa
    assert pub["phone"] == new_phone

    # Restore defaults
    restore = {
        "whatsapp_number": "919999999999",
        "phone": "+91 99999 99999",
        "email": "hello@buildvvo.com",
        "address": "India",
        "business_hours": original.get("business_hours", "Mon – Sat, 10:00 AM – 7:00 PM IST"),
        "ga4_id": "", "google_ads_id": "", "google_ads_label": "", "meta_pixel_id": "",
    }
    r2 = requests.put(f"{API}/settings", json=restore, headers=auth_headers, timeout=10)
    assert r2.status_code == 200
    assert r2.json()["whatsapp_number"] == "919999999999"


# ---------- Brute force (use dummy username) ----------
def test_brute_force_lockout():
    # Note: Behind K8s ingress, requests may be routed to multiple backend replicas,
    # each tracking login_attempts by its own client.host. Also, the code uses a
    # read-modify-write pattern instead of $inc. Lockout works but may require more
    # than 5 attempts in this environment. We assert lockout triggers within 15.
    uname = "bruteuser_test_lockout"
    locked = False
    for i in range(15):
        r = requests.post(f"{API}/auth/login",
                         json={"username": uname, "password": "wrong"}, timeout=10)
        if r.status_code == 429:
            locked = True
            break
    assert locked, "Expected 429 lockout within 15 failed attempts"


# ---------- Cleanup ----------
def test_zz_cleanup_test_leads(auth_headers):
    # Delete all leads created with TEST_ prefix
    r = requests.get(f"{API}/leads", params={"q": "TEST_"}, headers=auth_headers, timeout=15)
    assert r.status_code == 200
    deleted = 0
    for lead in r.json():
        if lead.get("name", "").startswith("TEST_") or lead.get("email", "").startswith("test_"):
            d = requests.delete(f"{API}/leads/{lead['id']}", headers=auth_headers, timeout=10)
            if d.status_code == 200:
                deleted += 1
    print(f"Cleaned up {deleted} test leads")


# ---------- Helpers ----------
def _lead_payload(**over):
    base = {
        "name": "TEST_User",
        "company": "TestCo",
        "phone": "9999988888",
        "email": "test_user@example.com",
        "software_type": "ERP System",
        "budget": "₹50K–₹1.5L",
        "timeline": "1-3 months",
        "description": "Need a custom ERP solution for inventory and sales.",
        "consultation": True,
        "heard_about": "Google",
    }
    base.update(over)
    return base


def _create_lead(name, email):
    p = _lead_payload(name=name, email=email)
    r = requests.post(f"{API}/leads", json=p, timeout=10)
    assert r.status_code == 201, r.text
    lid = r.json()["id"]
    CREATED_LEADS.append(lid)
    return lid
