import os
import secrets
from typing import Any, Dict, List, Union
from pydantic import AnyHttpUrl, BaseSettings, HttpUrl, validator
# from pydantic import AnyHttpUrl, BaseSettings, EmailStr, HttpUrl, validator


envPath = os.path.abspath(os.path.join(
    __file__, os.pardir, os.pardir, os.pardir, os.pardir, '.env'))
# print(envPath)


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    SERVER_NAME: str
    SERVER_HOST: AnyHttpUrl
    # BACKEND_CORS_ORIGINS is a JSON-formatted list of origins
    # e.g: '["http://localhost", "http://localhost:4200", "http://localhost:3000", \
    # "http://localhost:8080", "http://local.dockertoolbox.tiangolo.com"]'
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    PROJECT_NAME: str = "project"
    ROOT_TITLE: str = "Title"
    ROOT_DESCRIPTION: str = "Description"

    SENTRY_DSN: HttpUrl | None

    @validator("SENTRY_DSN", pre=True)
    def sentry_dsn_can_be_blank(cls, v: str) -> str | None:
        if len(v) == 0:
            return None
        return v

    MYSQL_SERVER: str
    MYSQL_USER: str
    MYSQL_PASSWORD: str
    MYSQL_DATABASE: str
    SQLALCHEMY_DATABASE_URI: str | None

    @validator("SQLALCHEMY_DATABASE_URI", pre=True)
    def assemble_db_connection(cls, v: str | None, values: Dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v
        user = values.get("MYSQL_USER")
        password = values.get("MYSQL_PASSWORD")
        host = values.get("MYSQL_SERVER")
        path = f"/{values.get('MYSQL_DATABASE') or ''}"
        return f'mysql+pymysql://{user}:{password}@{host}{path}'

    SMTP_TLS: bool = True
    SMTP_PORT: int | None = None
    SMTP_HOST: str | None = None
    SMTP_USER: str | None = None
    SMTP_PASSWORD: str | None = None
    EMAILS_FROM_EMAIL: str | None = None
    EMAILS_FROM_NAME: str | None = None

    @validator("EMAILS_FROM_NAME")
    def get_project_name(cls, v: str | None, values: Dict[str, Any]) -> str:
        if not v:
            return values["PROJECT_NAME"]
        return v

    EMAIL_RESET_TOKEN_EXPIRE_HOURS: int = 48
    EMAIL_TEMPLATES_DIR: str = "/app/app/email-templates/build"
    EMAILS_ENABLED: bool = False

    @validator("EMAILS_ENABLED", pre=True)
    def get_emails_enabled(cls, v: bool, values: Dict[str, Any]) -> bool:
        return bool(
            values.get("SMTP_HOST") and values.get(
                "SMTP_PORT") and values.get("EMAILS_FROM_EMAIL")
        )

    EMAIL_TEST_USER: str = "test@example.com"  # type: ignore
    FIRST_SUPERUSER: str
    FIRST_SUPERUSER_PASSWORD: str
    USERS_OPEN_REGISTRATION: bool = False

    class Config:
        case_sensitive = True
        env_file = envPath


settings = Settings()
