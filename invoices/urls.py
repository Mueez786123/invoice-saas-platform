from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CleintViewSet, InvoiceItemViewSet, InvoiceViewSet

router = DefaultRouter()

router.register(r'clients', CleintViewSet, basename='clients')
router.register(r'invoices', InvoiceViewSet, basename='invoices')
router.register(r'items', InvoiceItemViewSet, basename='items')


urlpatterns = [
    path('', include(router.urls)),
    
]
