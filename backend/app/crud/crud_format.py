# from typing import List
# from sqlmodel import Session, select

from app.crud.base import CRUDBase
from app.models.format import Formats, FormatCreate, FormatUpdate


class CRUDFormat(CRUDBase[Formats, FormatCreate, FormatUpdate]):
    pass


format = CRUDFormat(Formats)
