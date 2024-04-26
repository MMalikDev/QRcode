from configs.core import settings
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.responses import HTMLResponse, Response
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from lib.generate import generate_barcode, generate_QRcode
from lib.utilities import logger
from uvicorn import run

app = FastAPI()
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/", response_description="Webpage", response_class=HTMLResponse)
def index(request: Request) -> HTMLResponse:
    context = {
        "qrcodeAPI": app.url_path_for("qrcode"),
        "barcodeAPI": app.url_path_for("barcode"),
    }
    return templates.TemplateResponse(request, name="index.html", context=context)


@app.get("/api/barcode", response_description="Barcode SVG")
def barcode(data: str = "No data provided", type: str = "CODE128") -> Response:
    try:
        svg = generate_barcode(data, type)
        return Response(svg, media_type="image/svg+xml")

    except Exception as error:
        detail = f"{error.__class__.__name__} | {error}"
        logger.error(detail)
        raise HTTPException(status.HTTP_406_NOT_ACCEPTABLE, detail)


@app.get("/api/qrcode", response_description="QRcode SVG")
def qrcode(data: str = "No data provided") -> Response:
    svg = generate_QRcode(data)
    return Response(svg, media_type="image/svg+xml")


if __name__ == "__main__":
    run(app, host=settings.WEB_HOST, port=settings.WEB_PORT)
