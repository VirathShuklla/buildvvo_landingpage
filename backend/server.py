from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import re
import logging
from datetime import datetime, timezone, timedelta
from typing import Optional, List, Literal, Annotated

import bcrypt
import jwt
from bson import ObjectId
from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends, Query
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict, BeforeValidator, EmailStr

client = AsyncIOMotorClient(os.environ['MONGO_URL'])
db = client[os.environ['DB_NAME']]

app = FastAPI(title="BuildVVO API")
api = APIRouter(prefix="/api")
logger = logging.getLogger("buildvvo")
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

JWT_ALGORITHM = "HS256"
STATUSES = ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"]
QUALIFIED = {"Qualified", "Proposal Sent", "Won"}
BUDGETS = ["Under ₹50K", "₹50K–₹1.5L", "₹1.5L–₹5L", "₹5L+", "Not Sure"]
DEFAULT_SETTINGS = {
    "whatsapp_number": "919999999999",
    "phone": "+91 99999 99999",
    "email": "hello@buildvvo.com",
    "address": "India",
    "business_hours": "Mon – Sat, 10:00 AM – 7:00 PM IST",
    "ga4_id": "",
    "google_ads_id": "",
    "google_ads_label": "",
    "meta_pixel_id": "",
}


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


PyObjectId = Annotated[str, BeforeValidator(lambda v: str(v) if isinstance(v, ObjectId) else v)]


class BaseDocument(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="ignore")
    id: Optional[PyObjectId] = Field(default=None, alias="_id")

    def to_mongo(self) -> dict:
        data = self.model_dump(by_alias=True)
        if data.get("_id") is None:
            data.pop("_id", None)
        else:
            data["_id"] = ObjectId(data["_id"])
        return data

    @classmethod
    def from_mongo(cls, doc: dict):
        return cls.model_validate(doc)


class Note(BaseModel):
    text: str
    created_at: str = Field(default_factory=now_iso)


class Lead(BaseDocument):
    name: str
    company: str = ""
    phone: str
    email: str
    software_type: str
    budget: str
    timeline: str
    description: str
    consultation: bool = False
    heard_about: str = ""
    source: str = "Direct"
    landing_page: str = ""
    referrer: str = ""
    utm_campaign: str = ""
    utm_medium: str = ""
    status: str = "New"
    notes: List[Note] = []
    follow_up_date: Optional[str] = None
    created_at: str = Field(default_factory=now_iso)
    updated_at: str = Field(default_factory=now_iso)


class LeadCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    company: str = Field(default="", max_length=120)
    phone: str = Field(min_length=7, max_length=20)
    email: EmailStr
    software_type: str = Field(min_length=2, max_length=60)
    budget: Literal["Under ₹50K", "₹50K–₹1.5L", "₹1.5L–₹5L", "₹5L+", "Not Sure"]
    timeline: str = Field(min_length=2, max_length=60)
    description: str = Field(min_length=10, max_length=4000)
    consultation: bool = False
    heard_about: str = Field(default="", max_length=60)
    source: str = Field(default="Direct", max_length=60)
    landing_page: str = Field(default="", max_length=300)
    referrer: str = Field(default="", max_length=300)
    utm_campaign: str = Field(default="", max_length=120)
    utm_medium: str = Field(default="", max_length=120)
    website: str = ""  # honeypot


class LeadUpdate(BaseModel):
    status: Optional[Literal["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"]] = None
    source: Optional[str] = Field(default=None, max_length=60)
    follow_up_date: Optional[str] = None
    clear_follow_up: bool = False


class NoteCreate(BaseModel):
    text: str = Field(min_length=1, max_length=2000)


class LoginIn(BaseModel):
    username: str
    password: str


class SettingsIn(BaseModel):
    whatsapp_number: str = Field(max_length=20)
    phone: str = Field(max_length=30)
    email: str = Field(max_length=120)
    address: str = Field(max_length=300)
    business_hours: str = Field(max_length=120)
    ga4_id: str = Field(default="", max_length=40)
    google_ads_id: str = Field(default="", max_length=40)
    google_ads_label: str = Field(default="", max_length=80)
    meta_pixel_id: str = Field(default="", max_length=40)


class EventIn(BaseModel):
    type: Literal["whatsapp_click", "call_click", "email_click", "cta_click"]
    page: str = Field(default="", max_length=200)


# ---------- Auth ----------
def hash_password(p: str) -> str:
    return bcrypt.hashpw(p.encode(), bcrypt.gensalt()).decode()


def verify_password(p: str, h: str) -> bool:
    return bcrypt.checkpw(p.encode(), h.encode())


def create_access_token(user_id: str, username: str) -> str:
    payload = {"sub": user_id, "username": username, "type": "access",
               "exp": datetime.now(timezone.utc) + timedelta(hours=12)}
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        token = auth[7:]
    if not token:
        raise HTTPException(401, "Not authenticated")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Session expired")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token")
    if payload.get("type") != "access":
        raise HTTPException(401, "Invalid token type")
    user = await db.users.find_one({"_id": ObjectId(payload["sub"])}, {"password_hash": 0})
    if not user:
        raise HTTPException(401, "User not found")
    return {"id": str(user["_id"]), "username": user["username"], "email": user.get("email", ""), "role": user.get("role")}


@api.post("/auth/login")
async def login(body: LoginIn, request: Request):
    username = body.username.strip().lower()
    ip = request.client.host if request.client else "unknown"
    identifier = f"{ip}:{username}"
    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("locked_until") and attempt["locked_until"] > now_iso():
        raise HTTPException(429, "Too many failed attempts. Try again in 15 minutes.")
    user = await db.users.find_one({"username": username})
    if not user or not verify_password(body.password, user["password_hash"]):
        count = (attempt or {}).get("count", 0) + 1
        update = {"count": count}
        if count >= 5:
            update = {"count": 0, "locked_until": (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()}
        await db.login_attempts.update_one({"identifier": identifier}, {"$set": update}, upsert=True)
        raise HTTPException(401, "Invalid username or password")
    await db.login_attempts.delete_one({"identifier": identifier})
    uid = str(user["_id"])
    return {"token": create_access_token(uid, username),
            "user": {"id": uid, "username": username, "email": user.get("email", ""), "role": user.get("role")}}


@api.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user


# ---------- Public ----------
@api.get("/")
async def root():
    return {"message": "BuildVVO API"}


async def load_settings() -> dict:
    doc = await db.settings.find_one({"_id": "site"}, {"_id": 0}) or {}
    return {**DEFAULT_SETTINGS, **doc}


@api.get("/settings")
async def get_settings():
    return await load_settings()


@api.post("/leads", status_code=201)
async def create_lead(body: LeadCreate):
    if body.website:
        return {"id": "ok", "status": "received"}
    data = body.model_dump(exclude={"website"})
    data["email"] = str(data["email"]).lower()
    data = {k: (v.strip() if isinstance(v, str) else v) for k, v in data.items()}
    lead = Lead(**data)
    res = await db.leads.insert_one(lead.to_mongo())
    logger.info(f"New lead {res.inserted_id} from {lead.email}")
    return {"id": str(res.inserted_id), "status": "received"}


@api.post("/events", status_code=201)
async def create_event(body: EventIn):
    await db.events.insert_one({**body.model_dump(), "created_at": now_iso()})
    return {"ok": True}


# ---------- Admin ----------
@api.put("/settings")
async def update_settings(body: SettingsIn, user: dict = Depends(get_current_user)):
    data = body.model_dump()
    data["whatsapp_number"] = re.sub(r"\D", "", data["whatsapp_number"])
    await db.settings.update_one({"_id": "site"}, {"$set": data}, upsert=True)
    return await load_settings()


def oid(lead_id: str) -> ObjectId:
    if not ObjectId.is_valid(lead_id):
        raise HTTPException(404, "Lead not found")
    return ObjectId(lead_id)


@api.get("/leads")
async def list_leads(
    q: str = "", status: str = "", source: str = "", software_type: str = "",
    user: dict = Depends(get_current_user),
):
    query = {}
    if status:
        query["status"] = status
    if source:
        query["source"] = source
    if software_type:
        query["software_type"] = software_type
    if q:
        rx = {"$regex": re.escape(q), "$options": "i"}
        query["$or"] = [{"name": rx}, {"company": rx}, {"email": rx}, {"phone": rx}, {"description": rx}]
    docs = await db.leads.find(query).sort("created_at", -1).to_list(2000)
    return [Lead.from_mongo(d).model_dump() for d in docs]


@api.get("/leads/{lead_id}")
async def get_lead(lead_id: str, user: dict = Depends(get_current_user)):
    doc = await db.leads.find_one({"_id": oid(lead_id)})
    if not doc:
        raise HTTPException(404, "Lead not found")
    return Lead.from_mongo(doc).model_dump()


@api.patch("/leads/{lead_id}")
async def update_lead(lead_id: str, body: LeadUpdate, user: dict = Depends(get_current_user)):
    update = {k: v for k, v in body.model_dump(exclude={"clear_follow_up"}).items() if v is not None}
    if body.clear_follow_up:
        update["follow_up_date"] = None
    update["updated_at"] = now_iso()
    doc = await db.leads.find_one_and_update({"_id": oid(lead_id)}, {"$set": update}, return_document=True)
    if not doc:
        raise HTTPException(404, "Lead not found")
    return Lead.from_mongo(doc).model_dump()


@api.post("/leads/{lead_id}/notes")
async def add_note(lead_id: str, body: NoteCreate, user: dict = Depends(get_current_user)):
    note = Note(text=body.text.strip()).model_dump()
    doc = await db.leads.find_one_and_update(
        {"_id": oid(lead_id)}, {"$push": {"notes": note}, "$set": {"updated_at": now_iso()}}, return_document=True)
    if not doc:
        raise HTTPException(404, "Lead not found")
    return Lead.from_mongo(doc).model_dump()


@api.delete("/leads/{lead_id}")
async def delete_lead(lead_id: str, user: dict = Depends(get_current_user)):
    res = await db.leads.delete_one({"_id": oid(lead_id)})
    if not res.deleted_count:
        raise HTTPException(404, "Lead not found")
    return {"ok": True}


@api.get("/stats")
async def stats(user: dict = Depends(get_current_user)):
    leads = await db.leads.find({}, {"status": 1, "source": 1, "software_type": 1, "budget": 1,
                                     "consultation": 1, "created_at": 1, "follow_up_date": 1}).to_list(10000)
    total = len(leads)
    by = lambda key, keys=None: _count(leads, key, keys)
    won = sum(1 for l in leads if l.get("status") == "Won")
    lost = sum(1 for l in leads if l.get("status") == "Lost")
    qualified = sum(1 for l in leads if l.get("status") in QUALIFIED)
    today = datetime.now(timezone.utc).date()
    days = [(today - timedelta(days=i)).isoformat() for i in range(29, -1, -1)]
    daily = {d: {"date": d, "leads": 0, "qualified": 0} for d in days}
    for l in leads:
        d = (l.get("created_at") or "")[:10]
        if d in daily:
            daily[d]["leads"] += 1
            if l.get("status") in QUALIFIED:
                daily[d]["qualified"] += 1
    today_s = today.isoformat()
    due = sum(1 for l in leads if l.get("follow_up_date") and l["follow_up_date"] <= today_s
              and l.get("status") not in ("Won", "Lost"))
    wa = await db.events.count_documents({"type": "whatsapp_click"})
    return {
        "total": total,
        "qualified": qualified,
        "consultations": sum(1 for l in leads if l.get("consultation")),
        "won": won,
        "lost": lost,
        "new": sum(1 for l in leads if l.get("status") == "New"),
        "conversion_rate": round(won / total * 100, 1) if total else 0,
        "qualification_rate": round(qualified / total * 100, 1) if total else 0,
        "win_rate": round(won / (won + lost) * 100, 1) if (won + lost) else 0,
        "follow_ups_due": due,
        "whatsapp_clicks": wa,
        "by_status": by("status", STATUSES),
        "by_source": by("source"),
        "by_software": by("software_type"),
        "by_budget": by("budget", BUDGETS),
        "daily": list(daily.values()),
    }


def _count(leads, key, keys=None):
    counts = {}
    for l in leads:
        k = l.get(key) or "Unknown"
        counts[k] = counts.get(k, 0) + 1
    if keys:
        return [{"name": k, "value": counts.get(k, 0)} for k in keys]
    return sorted([{"name": k, "value": v} for k, v in counts.items()], key=lambda x: -x["value"])


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await db.users.create_index("username", unique=True)
    await db.login_attempts.create_index("identifier")
    await db.leads.create_index("created_at")
    await db.leads.create_index("status")
    username = os.environ["ADMIN_USERNAME"].lower()
    password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"username": username})
    if existing is None:
        await db.users.insert_one({"username": username, "email": os.environ.get("ADMIN_EMAIL", ""),
                                   "password_hash": hash_password(password), "role": "admin",
                                   "created_at": now_iso()})
    elif not verify_password(password, existing["password_hash"]):
        await db.users.update_one({"username": username}, {"$set": {"password_hash": hash_password(password)}})


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
