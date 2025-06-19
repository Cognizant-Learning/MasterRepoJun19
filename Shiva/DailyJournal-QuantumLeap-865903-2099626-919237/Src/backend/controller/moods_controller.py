from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/moods", tags=["moods"])

@router.get("/")
def get_moods():
    # ...get all available moods...
    return {"moods": []}

@router.get("/categories")
def get_mood_categories():
    # ...get mood categories...
    return {"categories": []}
