from django.urls import path

from . import views

app_name = "barcode"
urlpatterns = [
    path("api", views.Barcode.as_view(), name="api"),
]
