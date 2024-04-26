from django.core.handlers.wsgi import WSGIRequest
from django.http import HttpResponse
from django.views.generic import TemplateView
from lib.generate import generate_QRcode


class Index(TemplateView):
    template_name = "common/index.html"


class QRcode(TemplateView):
    def get(self, request: WSGIRequest) -> HttpResponse:
        if not (data := request.GET.get("data")):
            data = "No data provided"
        svg = generate_QRcode(data)
        return HttpResponse(svg, content_type="image/svg+xml")
