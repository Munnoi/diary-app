from django.shortcuts import render
from .models import DiaryEntry
from .serializers import DiaryEntrySerializer
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.db.models import Q
from django.utils import timezone
from datetime import timedelta

class RegisterView(APIView):
    permission_classes = []

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        if not username or not password:
            return Response({"error": "Username and password are required"}, status=400)
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=400)
        user = User.objects.create_user(username=username, password=password)
        return Response({"message": "User created successfully"})

class LoginView(APIView):
    permission_classes = []
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({"message": "Login successful"})
        else:
            return Response({"error": "Invalid credentials"}, status=400)

class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({"username": user.username})

class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        user.delete()
        return Response({"message": "Account deleted successfully"})

class EntryPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = "page_size"
    max_page_size = 50

class EntryListCreateView(generics.ListCreateAPIView): # New class-based view for listing and creating diary entries
    serializer_class = DiaryEntrySerializer
    permission_classes = [IsAuthenticated]
    pagination_class = EntryPagination

    def get_queryset(self):
        qs = DiaryEntry.objects.filter(user=self.request.user)
        q = self.request.query_params.get("q", "").strip()
        sort = self.request.query_params.get("sort", "-updated_at")
        period = self.request.query_params.get("period", "all") # week | month

        if q:
            qs = qs.filter(Q(title__icontains=q) | Q(content__icontains=q))

        if period == "week":
            qs = qs.filter(created_at__gte=timezone.now() - timedelta(days=7))
        elif period == "month":
            qs = qs.filter(created_at__gte=timezone.now() - timedelta(days=30))

        allowed = {"-updated_at", "updated_at", "-created_at", "created_at", "title", "-title"}
        if sort not in allowed:
            sort = "-updated_at"
        return qs.order_by(sort)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class EntryDetailView(generics.RetrieveUpdateDestroyAPIView): # New class-based view for retrieving, updating, and deleting diary entries
    serializer_class = DiaryEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DiaryEntry.objects.filter(user=self.request.user)