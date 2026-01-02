from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import( 
        ClientViewSet, InvoiceItemViewSet, InvoiceViewSet, RegisterView,
        PasswordRestRequestView, PasswordRestConfirmationView, UserProfileView
    )

router = DefaultRouter()

router.register(r'clients', ClientViewSet, basename='clients')
router.register(r'invoices', InvoiceViewSet, basename='invoices')
router.register(r'items', InvoiceItemViewSet, basename='items')


urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    
    path("password-reset/", PasswordRestRequestView.as_view(), name="password-reset-request"),
    path("password-reset-confirm/", PasswordRestConfirmationView.as_view(), name="password-reset-confirm"),
    path("profile/", UserProfileView.as_view(), name="user-profile")
    
    
]
