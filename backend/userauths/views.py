from django.shortcuts import render
from django.http import JsonResponse
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

# Restframework
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken

# Others
import json
import random

# Serializers
from userauths.serializer import MyTokenObtainPairSerializer, ProfileSerializer, RegisterSerializer, UserSerializer


# Models
from userauths.models import Profile, User


# This code defines a DRF View class called MyTokenObtainPairView, which inherits from TokenObtainPairView.
class MyTokenObtainPairView(TokenObtainPairView):
    # Here, it specifies the serializer class to be used with this view.
    serializer_class = MyTokenObtainPairSerializer

# This code defines another DRF View class called RegisterView, which inherits from generics.CreateAPIView.
class RegisterView(generics.CreateAPIView):
    # It sets the queryset for this view to retrieve all User objects.
    queryset = User.objects.all()
    # It specifies that the view allows any user (no authentication required).
    permission_classes = (AllowAny,)
    # It sets the serializer class to be used with this view.
    serializer_class = RegisterSerializer



# This is a DRF view defined as a Python function using the @api_view decorator.
@api_view(['GET'])
def getRoutes(request):
    # It defines a list of API routes that can be accessed.
    routes = [
        '/api/token/',
        '/api/register/',
        '/api/token/refresh/',
        '/api/test/'
    ]
    # It returns a DRF Response object containing the list of routes.
    return Response(routes)


# This is another DRF view defined as a Python function using the @api_view decorator.
# It is decorated with the @permission_classes decorator specifying that only authenticated users can access this view.
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def testEndPoint(request):
    # Check if the HTTP request method is GET.
    if request.method == 'GET':
        # If it is a GET request, it constructs a response message including the username.
        data = f"Congratulations {request.user}, your API just responded to a GET request."
        # It returns a DRF Response object with the response data and an HTTP status code of 200 (OK).
        return Response({'response': data}, status=status.HTTP_200_OK)
    # Check if the HTTP request method is POST.
    elif request.method == 'POST':
        try:
            # If it's a POST request, it attempts to decode the request body from UTF-8 and load it as JSON.
            body = request.body.decode('utf-8')
            data = json.loads(body)
            # Check if the 'text' key exists in the JSON data.
            if 'text' not in data:
                # If 'text' is not present, it returns a response with an error message and an HTTP status of 400 (Bad Request).
                return Response("Invalid JSON data", status=status.HTTP_400_BAD_REQUEST)
            text = data.get('text')
            # If 'text' exists, it constructs a response message including the received text.
            data = f'Congratulations, your API just responded to a POST request with text: {text}'
            # It returns a DRF Response object with the response data and an HTTP status code of 200 (OK).
            return Response({'response': data}, status=status.HTTP_200_OK)
        except json.JSONDecodeError:
            # If there's an error decoding the JSON data, it returns a response with an error message and an HTTP status of 400 (Bad Request).
            return Response("Invalid JSON data", status=status.HTTP_400_BAD_REQUEST)
    # If the request method is neither GET nor POST, it returns a response with an error message and an HTTP status of 400 (Bad Request).
    return Response("Invalid JSON data", status=status.HTTP_400_BAD_REQUEST)


# This code defines another DRF View class called ProfileView, which inherits from generics.RetrieveAPIView and used to show user profile view.
class ProfileView(generics.RetrieveAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ProfileSerializer

    def get_object(self):
        user_id = self.kwargs['user_id']

        user = User.objects.get(id=user_id)
        profile = Profile.objects.get(user=user)
        return profile
    

def generate_numeric_otp(length=7):
        # Generate a random 7-digit OTP
        otp = ''.join([str(random.randint(0, 9)) for _ in range(length)])
        return otp

from rest_framework.views import APIView

class PasswordEmailVerify(APIView):
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "Email is required in the request body."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)
        # TODO: Add your password reset logic here (e.g., send email)
        return Response({"message": "Password reset email sent."}, status=status.HTTP_200_OK)

class PasswordChangeView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer
    
    def create(self, request, *args, **kwargs):
        payload = request.data
        
        otp = payload['otp']
        uidb64 = payload['uidb64']
        reset_token = payload['reset_token']
        password = payload['password']

        print("otp ======", otp)
        print("uidb64 ======", uidb64)
        print("reset_token ======", reset_token)
        print("password ======", password)

        try:
            user = User.objects.get(id=uidb64, otp=otp)
        except User.DoesNotExist:
            return Response({"error": "Invalid or expired password reset link."}, status=status.HTTP_404_NOT_FOUND)

        user.set_password(password)
        user.otp = ""
        user.reset_token = ""
        user.save()

        return Response({"message": "Password Changed Successfully"}, status=status.HTTP_201_CREATED)
