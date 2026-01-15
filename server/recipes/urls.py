# recipes/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, LoginView, RecipeViewSet, BookmarkViewSet, CommentListCreateView

router = DefaultRouter()
router.register(r'recipes', RecipeViewSet, basename='recipe')
router.register(r'bookmarks', BookmarkViewSet, basename='bookmark')

urlpatterns = [
    path('auth/register', RegisterView.as_view(), name='register'),
    path('auth/login', LoginView.as_view(), name='login'),
    path('', include(router.urls)),
    path('recipes/<int:recipe_id>/comments', CommentListCreateView.as_view(), name='recipe-comments'),
]
