from sqlmodel import Session, select

from app.core.security import get_password_hash, verify_password
from app.crud.base import CRUDBase
from app.models.user import User, UserCreate, UserUpdate


class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    def get_by_login_id(self, db: Session, *, login_id: str) -> User | None:
        return db.exec(select(User).where(User.login_id == login_id)).first()

    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        db_obj = User(
            login_id=obj_in.login_id,
            hashed_password=get_password_hash(obj_in.password),
            is_superuser=obj_in.is_superuser,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self, db: Session, *, db_obj: User, obj_in: UserUpdate
    ) -> User:
        user_data = obj_in.dict(exclude_unset=True)
        if user_data["password"]:
            user_data["hashed_password"] = get_password_hash(
                user_data["password"])
            del user_data["password"]

        for key, value in user_data.items():
            setattr(db_obj, key, value)

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def authenticate(self, db: Session, *, login_id: str, password: str) -> User | None:
        user = self.get_by_login_id(db, login_id=login_id)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def is_active(self, user: User) -> bool:
        return user.is_active

    def is_superuser(self, user: User) -> bool:
        return user.is_superuser


user = CRUDUser(User)
