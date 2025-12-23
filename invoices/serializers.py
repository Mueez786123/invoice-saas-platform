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
class InvioceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = "__all__"
        
# --- INVOICE TRANSLATOR ---

class InvoiceSerializer(serializers.ModelSerializer):
    
    item = InvioceItemSerializer(many=True)
    class Meta:
        model = Invoice
        fields = '__all__'
        read_only_fields = ['user', 'invoice_number']
        
    def create(slef, validated_data):
        items_data = validated_data.pop('items')
        
        random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
        invoice = Invoice.objects.create(**validated_data)
        
        for item_data in items_data:
            InvoiceItem.objects.create(invoice=invoice, **item_data)
            
        return invoice
    