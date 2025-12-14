from django.urls import path
from . import views

urlpatterns = [
    path('callback/', views.callback_request, name='callback_request'),

]