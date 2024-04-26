from django.core.exceptions import BadRequest
from django.core.handlers.wsgi import WSGIRequest
from django.http import HttpResponse
from django.views.generic import TemplateView
from lib.generate import generate_barcode


class Index(TemplateView):
    template_name = "common/index.html"


class Barcode(TemplateView):
    def get(self, request: WSGIRequest) -> HttpResponse:
        if not (data := request.GET.get("data")):
            data = "No data provided"
        if not (name := request.GET.get("type")):
            name = "CODE128"
        try:
            svg = generate_barcode(data, name)
            return HttpResponse(svg, content_type="image/svg+xml")
        except Exception as error:
            raise BadRequest(error)
