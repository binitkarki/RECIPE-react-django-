# recipes/admin.py
from django.contrib import admin
from .models import Recipe, Bookmark, Comment

@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'author', 'difficulty', 'cooking_time', 'servings', 'created_at')
    search_fields = ('title', 'ingredients', 'description')

@admin.register(Bookmark)
class BookmarkAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'recipe', 'created_at')

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'author', 'recipe', 'created_at')
