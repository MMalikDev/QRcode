from io import BytesIO

import barcode
from barcode.writer import SVGWriter
from qrcode import constants
from qrcode.image import svg
from qrcode.main import QRCode


def generate_QRcode(data: str) -> str:
    code = QRCode(
        error_correction=constants.ERROR_CORRECT_L,
        image_factory=svg.SvgPathImage,
        box_size=20,
        border=4,
    )

    code.add_data(data)
    code.make(fit=True)
    image = code.make_image()
    return image.to_string(encoding="unicode")


def generate_barcode(data: str, name: str = "EAN13") -> str:
    options = {
        "module_width": 0.25,
        "module_height": 8,
        "quiet_zone": 1.0,
        "font_size": 8,
        "text_distance": 2.5,
        "background": "transparent",
        "foreground": "black",
        "center_text": True,
    }
    output = BytesIO()
    barcode.generate(name, data, SVGWriter(), output, writer_options=options)
    return output.getvalue().decode()
