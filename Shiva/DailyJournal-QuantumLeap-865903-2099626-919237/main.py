from fastapi import FastAPI
from src.backend.controller import (
    users_controller,
    tags_controller,
    moods_controller,
    journals_controller,
    auth_controller,
    auth_jwt_controller,
)

app = FastAPI()

app.include_router(users_controller.router)
app.include_router(tags_controller.router)
app.include_router(moods_controller.router)
app.include_router(journals_controller.router)
app.include_router(auth_controller.router)
app.include_router(auth_jwt_controller.router)
