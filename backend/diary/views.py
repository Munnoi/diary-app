from django.shortcuts import render
from .models import DiaryEntry
from .serializers import DiaryEntrySerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(["GET"])
def diary_entry_list(request):
    entries = DiaryEntry.objects.all().order_by('-created_at')
    serializer = DiaryEntrySerializer(entries, many=True)
    return Response(serializer.data)

@api_view(["POST"])
def add_diary_entry(request):
    entry = DiaryEntry.objects.create(
        title=request.data.get("title", ""),
        content=request.data.get("content", ""),
    )
    serializer = DiaryEntrySerializer(entry)
    return Response(serializer.data)

@api_view(["GET"])
def diary_entry_detail(request, pk):
    entry = DiaryEntry.objects.get(pk=pk)
    serializer = DiaryEntrySerializer(entry)
    return Response(serializer.data)

@api_view(["PUT"])
def edit_diary_entry(request, pk):
    entry = DiaryEntry.objects.get(pk=pk) 
    entry.title = request.data.get("title", entry.title)
    entry.content = request.data.get("content", entry.content)
    entry.save()
    serializer = DiaryEntrySerializer(entry)
    return Response(serializer.data)

@api_view(["DELETE"])
def delete_diary_entry(request, pk):
    entry = DiaryEntry.objects.get(pk=pk)
    entry.delete()
    return Response({"message": "Entry deleted successfully"})