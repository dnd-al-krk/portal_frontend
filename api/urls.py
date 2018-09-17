from django.conf.urls import url, include
from django.urls import path
from rest_framework.routers import DefaultRouter
from profiles.api import views as profiles_views

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'characters', profiles_views.PlayerCharacterViewSet)
router.register(r'notes', profiles_views.DMNoteViewSet)
router.register(r'profiles', profiles_views.ProfileViewSet)
router.register(r'classes', profiles_views.CharacterClassListView)
router.register(r'races', profiles_views.CharacterRaceListView)
router.register(r'factions', profiles_views.CharacterFactionListView)
# router.register(r'register', profiles_views.RegistrationView)

# The API URLs are now determined automatically by the router.
urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'register/?$', profiles_views.RegistrationView.as_view()),
    url(r'^current_user/?$', profiles_views.CurrentUserView.as_view()),
]
