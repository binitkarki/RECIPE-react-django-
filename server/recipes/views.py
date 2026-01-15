from rest_framework import generics, viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Recipe, Bookmark, Comment
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import RegisterSerializer, RecipeSerializer, BookmarkSerializer, CommentSerializer

# Auth
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# Recipes
class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all().order_by('-created_at')
    serializer_class = RecipeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    # Enable search + category filtering
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['title', 'description', 'ingredients', 'category']
    filterset_fields = ['category']

    def perform_create(self, serializer):

        if self.request.user.is_authenticated:
            serializer.save(author=self.request.user)
        else:
            serializer.save(author=None)

    def perform_update(self, serializer):
        recipe = self.get_object()
        
        if recipe.author is None:
            raise permissions.PermissionDenied("Default recipes cannot be modified")
        if recipe.author != self.request.user:
            raise permissions.PermissionDenied("Not allowed")
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        recipe = self.get_object()
        
        if recipe.author is None:
            return Response({'detail': 'Default recipes cannot be deleted'}, status=status.HTTP_403_FORBIDDEN)
        if recipe.author != request.user:
            return Response({'detail': 'Not allowed'}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def mine(self, request):
        
        recipes = Recipe.objects.filter(author=request.user).order_by('-created_at')
        serializer = self.get_serializer(recipes, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def increment_view(self, request, pk=None):
        recipe = self.get_object()
        recipe.views = (recipe.views or 0) + 1
        recipe.save(update_fields=['views'])
        return Response({'views': recipe.views})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def like(self, request, pk=None):
        recipe = self.get_object()
        user = request.user
        if recipe.likes.filter(id=user.id).exists():
            recipe.likes.remove(user)
            liked = False
        else:
            recipe.likes.add(user)
            liked = True
        return Response({'liked': liked, 'likes_count': recipe.likes.count()})

# Bookmarks
class BookmarkViewSet(viewsets.ModelViewSet):
    serializer_class = BookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Bookmark.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Comments
class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        recipe_id = self.kwargs['recipe_id']
        return Comment.objects.filter(recipe_id=recipe_id).order_by('-created_at')

    def perform_create(self, serializer):
        recipe_id = self.kwargs['recipe_id']
        serializer.save(author=self.request.user, recipe_id=recipe_id)
