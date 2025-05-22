from django.urls import path
from userauths import views as userauths_views
from store import views as store_views

from rest_framework_simplejwt.views import TokenRefreshView
from userauths.views import PasswordEmailVerify

urlpatterns = [
    # path('', userauths_views.getRoutes),

    # Userauths API Endpoints
    path('user/token/', userauths_views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('user/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/register/', userauths_views.RegisterView.as_view(), name='auth_register'),
    path('user/password-reset/email/', PasswordEmailVerify.as_view(), name='password_email_verify'),
]