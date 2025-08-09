from django.urls import path
from . import views
from .views import textToImage
from .views import text_to_image_history

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path("generate-image/", textToImage, name="generate-image"),
    path('history/', text_to_image_history, name='text-to-image-history'),

]