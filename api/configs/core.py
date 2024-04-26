from lib.utilities import load_variable


class Settings:
    WEB_HOST: str = load_variable("WEB_HOST", "0.0.0.0")
    WEB_PORT: int = int(load_variable("WEB_PORT", "8080"))


settings = Settings()
