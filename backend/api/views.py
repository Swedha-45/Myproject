from django.shortcuts import render
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
from django.contrib.auth import get_user_model




load_dotenv()
api_key = os.getenv("HF_TOKEN")

User = get_user_model()
queryset = User.objects.all()

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

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return JsonResponse(serializer.data, status=201)
        else:
            print("❌ Serializer errors:", serializer.errors)  # <--- add this
            return JsonResponse(serializer.errors, status=400)




@csrf_exempt
def textToImage(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST requests are allowed."}, status=405)

    try:
        # Parse JSON from request body
        data = json.loads(request.body.decode("utf-8"))
        prompt = data.get("text")

        if not prompt:
            return JsonResponse({"error": "The 'text' field is required."}, status=400)

        # Load API key
        api_key = os.getenv("HF_TOKEN")
        if not api_key:
            print("❌ HF_TOKEN not found in .env file.")
            return JsonResponse({"error": "Hugging Face API token is missing."}, status=500)

        # Initialize Hugging Face client
        client = InferenceClient(provider="nebius", api_key=api_key)

        print(f"✅ Generating image for prompt: '{prompt}'")

        # Call Hugging Face API
        image = client.text_to_image(
            prompt,
            model="black-forest-labs/FLUX.1-dev",
        )

        # Convert image to base64
        if isinstance(image, Image.Image):
            buffer = BytesIO()
            image.save(buffer, format="PNG")
            image_str = base64.b64encode(buffer.getvalue()).decode("utf-8")
            print("✅ Image generation successful.")
            return JsonResponse({"image_data": image_str})
        else:
            print("❌ Hugging Face did not return an image.")
            return JsonResponse({"error": "Image generation failed."}, status=500)

    except json.JSONDecodeError:
        print("❌ Failed to decode JSON from request.")
        return JsonResponse({"error": "Invalid JSON format."}, status=400)

    except Exception as e:
        print(f"❌ Unexpected error during image generation: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)



