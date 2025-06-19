from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/tags", tags=["tags"])

@router.get("/")
def get_tags():
    # ...get all user tags...
    return {"tags": []}

@router.post("/")
def create_tag():
    # ...create new tag...
    return {"message": "Tag created"}

@router.put("/{id}")
def update_tag(id: int):
    # ...update tag...
    return {"message": "Tag updated"}

@router.delete("/{id}")
def delete_tag(id: int):
    # ...delete tag...
    return {"message": "Tag deleted"}
