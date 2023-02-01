# from typing import List
# from sqlmodel import Session, select

from app.crud.base import CRUDBase
from app.models.resource import Resources, ResourceCreate, ResourceUpdate


class CRUDFormat(CRUDBase[Resources, ResourceCreate, ResourceUpdate]):
    pass


resource = CRUDFormat(Resources)
