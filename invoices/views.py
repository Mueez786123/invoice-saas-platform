from rest_framework import viewsets, permissions
from .models import Client, Invoice, InvoiceItem
from .serializers import ClientSerializer, InvioceItemSerializer, InvoiceSerializer


## Client View

class CleintViewSet(viewsets.ModelViewSet):
    serializer_class = ClientSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Client.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
# Invoive View

class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Invoice.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
## Item view

class InvoiceItemViewSet(viewsets.ModelViewSet):
    serializer_class = InvioceItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return InvoiceItem.objects.filter(user=self.request.user)
    
    
    