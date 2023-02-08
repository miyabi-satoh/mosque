# from typing import List
# from sqlmodel import Session, select

from app.crud.base import CRUDBase
from app.models.asset import Assets, AssetCreate, AssetUpdate


class CRUDAsset(CRUDBase[Assets, AssetCreate, AssetUpdate]):
    pass


asset = CRUDAsset(Assets)
