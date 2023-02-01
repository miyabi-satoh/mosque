import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlmodel import Session

from app import crud
from app.db.session import get_db

router = APIRouter()


@router.get("/{resource_id}/{title}")
async def read_file(
    resource_id: int,
    title: str,
    db: Session = Depends(get_db)
):
    # titleはPDF表示のタイトル
    resource = crud.resource.get(db, id=resource_id)
    if not resource:
        raise HTTPException(
            status_code=404,
            detail="The resource with this id does not exist in the system",
        )
    if not os.path.isfile(resource.path):
        raise HTTPException(
            status_code=404,
            detail="The resource with this path does not exist in the system",
        )

    basename_without_ext, ext = resource.path.split('.', 1)
    filename = resource.slug + '.' + ext
    # filename = urllib.parse.quote(filename)
    return FileResponse(resource.path, filename=filename, content_disposition_type="inline")
