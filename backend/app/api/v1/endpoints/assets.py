import os
import aiohttp
import contextlib
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse, StreamingResponse
from sqlmodel import Session
from typing import AsyncGenerator

from app import crud
from app.db.session import get_db

router = APIRouter()


async def get_exit_stack() -> AsyncGenerator[contextlib.AsyncExitStack, None]:
    async with contextlib.AsyncExitStack() as stack:
        yield stack


async def get_aiohttp_session() -> AsyncGenerator[aiohttp.ClientSession, None]:
    async with aiohttp.ClientSession() as session:
        yield session


@router.get("/{asset_id}/{dummy_title}")
async def read_file(
    asset_id: int,
    dummy_title: str,
    db: Session = Depends(get_db),
    exit_stack: contextlib.AsyncExitStack = Depends(get_exit_stack),
    session: aiohttp.ClientSession = Depends(get_aiohttp_session),
):
    # dummy_titleはPDF表示のタイトルになるダミーパラメータ
    asset = crud.asset.get(db, id=asset_id)
    if not asset:
        raise HTTPException(
            status_code=404,
            detail="The resource with this id does not exist in the system",
        )

    if asset.uri.startswith('http'):
        res = await exit_stack.enter_async_context(
            session.get(url=asset.uri)
        )
        if res.status != 200:
            raise HTTPException(status_code=404, detail="Failed to download")

        return StreamingResponse(
            content=res.content.iter_chunked(1 * 1024),
            media_type=res.headers["content-type"],
        )

    if not os.path.isfile(asset.uri):
        raise HTTPException(
            status_code=404,
            detail="The resource with this uri does not exist in the system",
        )

    _, ext = asset.uri.split('.', 1)
    filename = asset.slug + '.' + ext
    # filename = urllib.parse.quote(filename)
    return FileResponse(asset.uri, filename=filename, content_disposition_type="inline")
