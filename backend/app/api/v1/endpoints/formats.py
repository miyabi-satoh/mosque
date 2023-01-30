import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlmodel import Session

from app import crud
from app.db.session import get_db

router = APIRouter()


@router.get("/{format_id}/{title}")
async def read_file(
    format_id: int,
    title: str,
    db: Session = Depends(get_db)
):
    # titleはPDF表示のタイトル
    format = crud.format.get(db, id=format_id)
    if not format:
        raise HTTPException(
            status_code=404,
            detail="The format with this id does not exist in the system",
        )
    if not os.path.isfile(format.real_path):
        raise HTTPException(
            status_code=404,
            detail="The format with this path does not exist in the system",
        )

    filename = os.path.basename(format.real_path)
    # filename = urllib.parse.quote(filename)
    return FileResponse(format.real_path, filename=filename, content_disposition_type="inline")
