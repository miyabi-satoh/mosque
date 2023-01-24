from sqlmodel import Session
from app import crud, models
from app.core.config import settings

# make sure all SQL Alchemy models are imported (app.db.base) before initializing DB
# otherwise, SQL Alchemy might fail to initialize relationships properly
# for more details: https://github.com/tiangolo/full-stack-fastapi-postgresql/issues/28


def init_db(db: Session) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next line
    # Base.metadata.create_all(bind=engine)

    user = crud.user.get_by_login_id(db, login_id=settings.FIRST_SUPERUSER)
    if not user:
        user_in = models.UserCreate(
            login_id=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_superuser=True,
        )
        user = crud.user.create(db, obj_in=user_in)  # noqa: F841

    page_in = models.PageCreate(
        url='/',
        title=settings.ROOT_TITLE,
        description=settings.ROOT_DESCRIPTION,
        is_menuitem=False
    )
    page = crud.page.get_by_url(db, url=page_in.url)
    if not page:
        page = crud.page.create(db, obj_in=page_in)
    else:
        page = crud.page.update(db, db_obj=page, obj_in=page_in)

    page_in = models.PageCreate(
        url='/links',
        title='リンク集',
        description='よくアクセスするサイトや、授業で使えるサイトへのリンクをまとめました。(ガルーン、GDLS, ちびむす, 大学入試過去問, MugenPなど)',
        is_menuitem=True
    )
    page = crud.page.get_by_url(db, url=page_in.url)
    if not page:
        page = crud.page.create(db, obj_in=page_in)
    else:
        page = crud.page.update(db, db_obj=page, obj_in=page_in)
