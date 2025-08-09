
from rest_framework import serializers
from .models import Note
from django.contrib.auth import get_user_model
from .models import TextToImageHistory



User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user
class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}
class TextToImageHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TextToImageHistory
        fields = ['id', 'prompt', 'generated_image', 'created_at']