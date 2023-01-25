import json
import os
from sqlmodel import Session
from app import crud, models
from app.core.config import settings

# make sure all SQL Alchemy models are imported (app.db.base) before initializing DB
# otherwise, SQL Alchemy might fail to initialize relationships properly
# for more details: https://github.com/tiangolo/full-stack-fastapi-postgresql/issues/28


def init_db(db: Session) -> None:
    baseDir = os.path.abspath(os.path.join(
        __file__, os.pardir, os.pardir, os.pardir, settings.OVERRIDE_JSON_DIR))
    if not os.path.isdir(baseDir):
        baseDir = settings.OVERRIDE_JSON_DIR

    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-baseDir the next line
    # Base.metadata.create_all(bind=engine)

    user = crud.user.get_by_login_id(db, login_id=settings.FIRST_SUPERUSER)
    if not user:
        user_in = models.UserCreate(
            login_id=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_superuser=True,
        )
        user = crud.user.create(db, obj_in=user_in)  # noqa: F841

    pages = [
        models.Page(
            url='/',
            title=settings.ROOT_TITLE,
            description=settings.ROOT_DESCRIPTION,
            is_menuitem=False
        ),
        models.Page(
            url='/links',
            title='リンク集',
            description='よくアクセスするサイト。',
            is_menuitem=True
        ),
        models.Page(
            url='/test',
            title='テスト',
            description='テストページ。',
            is_menuitem=True
        )
    ]
    for page_in in pages:
        page = crud.page.get_by_url(db, url=page_in.url)
        if not page:
            page = crud.page.create(db, obj_in=page_in)
        else:
            page = crud.page.update(db, db_obj=page, obj_in=page_in)

    jsonPath = os.path.join(baseDir, "pages.json")
    if os.path.isfile(jsonPath):
        with open(jsonPath, mode='r') as f:
            for page in json.load(f):
                db_page = crud.page.get_by_url(db, url=page.get("url", ""))
                if db_page:
                    page_in = models.PageUpdate(
                        title=page.get('title', db_page.title),
                        description=page.get(
                            'description', db_page.description)
                    )
                    crud.page.update(db, db_obj=db_page, obj_in=page_in)

    jsonPath = os.path.join(baseDir, "links.json")
    if os.path.isfile(jsonPath):
        with open(jsonPath, mode='r') as f:
            for link in json.load(f):
                db_link = crud.link.get_by_url(db, url=link.get("url", ""))
                if db_link:
                    link_in = models.LinkUpdate(
                        title=link.get('title', db_link.title),
                        description=link.get(
                            'description', db_link.description)
                    )
                    crud.link.update(db, db_obj=db_link, obj_in=link_in)
                else:
                    link_in = models.LinkCreate(
                        url=link.get('url', None),
                        title=link.get('title', None),
                        description=link.get(
                            'description', None)
                    )
                    crud.link.create(db, obj_in=link_in)
