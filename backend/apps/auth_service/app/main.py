from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apps.auth_service.app.core.config import settings
from apps.auth_service.app.core.errors import app_exception_handler, validation_exception_handler
from apps.auth_service.app.db.session import init_db
from libs.shared.shared.errors.exceptions import AppException
from pydantic import ValidationError
from apps.auth_service.app.api.v1.routes import auth, profile

app = FastAPI(title=settings.app_name, version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(ValidationError, validation_exception_handler)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(profile.router, prefix="/api/v1")


@app.on_event("startup")
async def startup_event():
    init_db()


@app.get("/health")
async def health():
    return {"status": "ok"}
