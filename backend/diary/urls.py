from django.urls import path
from . import views

urlpatterns = [
    path("entries/", views.diary_entry_list, name="diary_entry_list"),
    path("entries/add/", views.add_diary_entry, name="add_diary_entry"),
    path("entries/edit/<int:pk>/", views.edit_diary_entry, name="edit_diary_entry"),
    path("entries/delete/<int:pk>/", views.delete_diary_entry, name="delete_diary_entry"),
]