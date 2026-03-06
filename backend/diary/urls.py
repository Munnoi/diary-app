from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path("auth/register/", views.RegisterView.as_view()),
    path("auth/login/", TokenObtainPairView.as_view()),
    path("auth/refresh/", TokenRefreshView.as_view()),
    path("auth/me/", views.MeView.as_view(), name="me"),
    
    path("entries/", views.EntryListCreateView.as_view(), name="entry-list-create"),
    path("entries/<int:pk>/", views.EntryDetailView.as_view(), name="entry-detail"),

]