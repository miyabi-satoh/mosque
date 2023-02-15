import os
import glob
import datetime
import re
import requests
import hashlib
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlmodel import Session

from app import crud
from app.core.config import settings
from app.db.session import get_db

router = APIRouter()


@router.get("/{asset_id}/{dummy_title}")
async def read_file(
    asset_id: int,
    dummy_title: str,
    db: Session = Depends(get_db),
):
    # dummy_titleはPDF表示のタイトルになるダミーパラメータ
    asset = crud.asset.get(db, id=asset_id)
    if not asset:
        raise HTTPException(
            status_code=404,
            detail="The resource with this id does not exist in the system",
        )

    if os.path.isfile(asset.uri):
        _, ext = asset.uri.split('.', 1)
        filename = asset.slug + '.' + ext
        return FileResponse(asset.uri, filename=filename, content_disposition_type="inline")

    if asset.uri.startswith('http'):
        # URLのハッシュ値を取得
        hs = hashlib.md5(asset.uri.encode()).hexdigest()
        # キャッシュ用のディレクトリ
        dir = os.path.join(settings.PJROOT, 'cache', hs)
        os.makedirs(dir, exist_ok=True)
        print(dir)
        # ディレクトリ内のファイルを取得
        for filepath in glob.glob(os.path.join(dir, '*')):
            print(filepath)
            # ファイルの更新日時を取得
            mtime = datetime.datetime.fromtimestamp(os.path.getmtime(filepath))
            # 期間を比較
            today = datetime.datetime.now()
            span = datetime.timedelta(weeks=4)
            if (mtime + span > today):
                # キャッシュ有効
                return FileResponse(filepath, filename=os.path.basename(filepath), content_disposition_type="inline")

        # ファイルをダウンロードして保存
        response = requests.get(asset.uri)
        if response.status_code == requests.codes.ok:
            if "Content-Disposition" in response.headers.keys():
                filename = re.findall(
                    "filename=(.+)", response.headers["Content-Disposition"])[0]
            else:
                filename = asset.uri.split("/")[-1]

            filepath = os.path.join(dir, filename)
            with open(filepath, 'wb') as f:
                f.write(response.content)

            print(filepath)
            if os.path.isfile(filepath):
                return FileResponse(filepath, filename=os.path.basename(filepath), content_disposition_type="inline")

    raise HTTPException(status_code=404, detail="Failed to download")
