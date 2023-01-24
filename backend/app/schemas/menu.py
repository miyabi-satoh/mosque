from typing import Optional

from pydantic import BaseModel
# from pydantic import BaseModel, EmailStr


# Shared properties
class MenuBase(BaseModel):
    url: str
    title: str
    description: Optional[str] = ''


class Menu(MenuBase):
    pass


class MenuCreate(MenuBase):
    pass

# Properties to receive via API on update


class MenuUpdate(MenuBase):
    pass
