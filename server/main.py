from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database import init_db
from .settings import settings
from .router import item, rider, delivery, delivery_batch

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    yield
    # Shutdown
    pass

app = FastAPI(
    title=settings.TITLE,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    license_info={
        "name": settings.LICENSE_NAME,
    },
    openapi_tags=[],
    lifespan=lifespan,
)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:5000",
    "http://localhost:5000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(item.router)
app.include_router(rider.router)
app.include_router(delivery.router) 
app.include_router(delivery_batch.router)   

@app.get("/")
async def read_root():
    return {"Hello": "World!"}
