from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apps.search_service.app.core.config import settings
from apps.search_service.app.db.session import init_db
from apps.search_service.app.api.v1.routes import search

app = FastAPI(title=settings.app_name, version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(search.router, prefix="/api/v1")


@app.on_event("startup")
async def startup_event():
    init_db()


@app.get("/health")
async def health():
    return {"status": "ok"}
