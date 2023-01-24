from typing import Optional

from pydantic import BaseModel
# from pydantic import BaseModel, EmailStr


# Shared properties
class PageBase(BaseModel):
    url: str
    title: str
    description: Optional[str] = ''
    is_menuitem: bool = False


class PageCreate(PageBase):
    pass

# Properties to receive via API on update


class PageUpdate(PageBase):
    pass


class PageInDBBase(PageBase):
    id: Optional[int] = None

    class Config:
        orm_mode = True


class Page(PageInDBBase):
    pass
