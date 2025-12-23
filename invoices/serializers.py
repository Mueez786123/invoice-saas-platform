from rest_framework import serializers
from .models import Invoice, InvoiceItem, Client
import random
import string

# --- CLIENT TRANSLATOR ---
class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'
        read_only_fields = ['user']

# --- ITEM TRANSLATOR ---
class InvoiceItemSerializer(serializers.ModelSerializer):  # Spelling Fixed
    class Meta:
        model = InvoiceItem
        fields = "__all__"

# --- INVOICE TRANSLATOR ---
class InvoiceSerializer(serializers.ModelSerializer):
    # Name 'items' hona chahiye taaki frontend ke 'items' se match kare
    items = InvoiceItemSerializer(many=True) 
    
    class Meta:
        model = Invoice
        fields = '__all__'
        read_only_fields = ['user', 'invoice_number']
        
    def create(self, validated_data): # Fixed 'slef' to 'self'
        items_data = validated_data.pop('items') # Fixed 'item' to 'items'
        
        random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
        validated_data['invoice_number'] = f"INV-{random_str}" # Add prefix INV-
        
        invoice = Invoice.objects.create(**validated_data)
        
        for item_data in items_data:
            InvoiceItem.objects.create(invoice=invoice, **item_data)
            
        return invoice