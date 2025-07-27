from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note
import json
import base64
from io import BytesIO
from PIL import Image
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from huggingface_hub import InferenceClient
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("HF_TOKEN")

class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

@csrf_exempt
def textToImage(req):
    if req.method == "POST":
        try:
            data = json.loads(req.body.decode("utf-8"))
            text = data.get("text")

            if not text:
                return JsonResponse({"error": "Text is required"}, status=400)

            client = InferenceClient(
                provider="nebius",
                api_key=api_key,
            )

            image = client.text_to_image(
                text,
                model="black-forest-labs/FLUX.1-dev",
            )

            if isinstance(image, Image.Image):
                buffered = BytesIO()
                image.save(buffered, format="PNG")
                img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

                return JsonResponse({"image_data": img_str})
            else:
                return JsonResponse({"error": "Image generation failed"}, status=500)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method. Use POST."}, status=405)


