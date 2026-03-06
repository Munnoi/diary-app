from rest_framework import serializers
from .models import DiaryEntry

class DiaryEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = DiaryEntry
        fields = "__all__"
        read_only_fields = ['id', 'created_at', 'updated_at', 'user']