from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

DATA_PATH = Path(__file__).resolve().parent / "data" / "vendors.json"


class Antenna(BaseModel):
    technology: str = Field(..., description="Radio access technology name")
    speedMbps: str = Field(..., description="Speed value reported as '<value> Mbps'")


class Vendor(BaseModel):
    id: str
    picture: str
    foundationDate: int
    vendor: str
    antennas: List[Antenna]


@lru_cache(maxsize=1)
def load_vendors() -> List[Vendor]:
    if not DATA_PATH.exists():
        raise HTTPException(status_code=500, detail="Vendors dataset not found")

    with DATA_PATH.open("r", encoding="utf-8") as file:
        data = json.load(file)

    return [Vendor(**item) for item in data]


app = FastAPI(title="Telco Vendor Performance API", version="0.1.0")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://pruebafutcon.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/vendors", response_model=List[Vendor], tags=["vendors"])
def get_vendors() -> List[Vendor]:
    return load_vendors()


def run_dev() -> None:
    """Convenience entrypoint for local development."""
    import uvicorn

    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
