from rest_framework import viewsets, permissions
from .models import Client, Invoice, InvoiceItem
# Imports bhi sahi karo spelling fix ke baad
from .serializers import ClientSerializer, InvoiceItemSerializer, InvoiceSerializer

## Client View
class ClientViewSet(viewsets.ModelViewSet): # Fixed Spelling 'Cleint'
    serializer_class = ClientSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Client.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
# Invoice View
class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Invoice.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
## Item view
class InvoiceItemViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # InvoiceItem ke paas direct user nahi hai, invoice ke through user check karenge
        return InvoiceItem.objects.filter(invoice__user=self.request.user)