# from typing import TYPE_CHECKING

from sqlalchemy import Column, Integer, String
# from sqlalchemy.orm import relationship

from app.db.base_class import Base

# if TYPE_CHECKING:
#     from .item import Item  # noqa: F401


class Menu(Base):
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String(255), nullable=False)
    title = Column(String(20), nullable=False)
    description = Column(String(150))
    # items = relationship("Item", back_populates="owner")
