from app.crud.base import CRUDBase
from app.models.menu import Menu
from app.schemas.menu import MenuCreate, MenuUpdate


class CRUDMenu(CRUDBase[Menu, MenuCreate, MenuUpdate]):
    pass


menu = CRUDMenu(Menu)
