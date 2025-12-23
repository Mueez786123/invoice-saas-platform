from rest_framework import viewsets, permissions
from .models import Client, Invoice, InvoiceItem
# Imports bhi sahi karo spelling fix ke baad
from .serializers import ClientSerializer, InvoiceItemSerializer, InvoiceSerializer
from django.http import HttpResponse
from django.template.loader import get_template
from xhtml2pdf import pisa
from rest_framework.decorators import action
from django.shortcuts import render, get_object_or_404

from rest_framework.permissions import IsAuthenticated, AllowAny 


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
        
    ## pdf generator function yaha banayenge
    @action(detail=True, methods=['get'], permission_classes = [AllowAny])
    def download(self, request, pk=None):
        #1 jis invoice ka pdf chahiye use database se nikalo
        invoice = get_object_or_404(Invoice, pk=pk)
        #2. HTML template load karo
        template_path = 'invoices/pdf_template.html'
        context = {'invoice': invoice}
        template = get_template(template_path)
        html = template.render(context)
        
        # 3. Pdf Response banao
        response = HttpResponse(content_type='application/pdf')
        
        # for pdf download   
        response['Content-Disposition'] = f'attachment; filename="Invoice_{invoice.invoice_number}.pdf"'
        response['Content-Disposition'] = f'filename="Invoice_{invoice.invoice_number}.pdf"'
        # 4. HTML se PDF convert karo
        pisa_status = pisa.CreatePDF(html, dest=response)
        
        if pisa_status.err:
            return HttpResponse('We had some error <pre>' + html + '</pre>')

        return response

class InvoiceItemViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # InvoiceItem ke paas direct user nahi hai, invoice ke through user check karenge
        return InvoiceItem.objects.filter(invoice__user=self.request.user)