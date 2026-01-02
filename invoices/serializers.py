from rest_framework import serializers
from .models import Invoice, InvoiceItem, Client, UserProfile
import random
import string
from django.contrib.auth.models import User


# --- CLIENT SERIALIZER ---
class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'
        read_only_fields = ['user']

# --- ITEM SERIALIZER ---
class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = "__all__"
        read_only_fields = ['invoice']

# --- INVOICE SERIALIZER ---
class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True)

    class Meta:
        model = Invoice
        fields = '__all__'
        read_only_fields = ['user', 'invoice_number']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
        validated_data['invoice_number'] = f"INV-{random_str}"
        
        invoice = Invoice.objects.create(**validated_data)
        
        for item_data in items_data:
            InvoiceItem.objects.create(invoice=invoice, **item_data)
            
        return invoice

# --- USER SERIALIZER (Fix Yahan Hai) ---
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    # ✅ Sahi Jagah: Meta se bahar, Class ke level par
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class PasswordRestRequrestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordRestConfirmSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True)
    uid = serializers.CharField()
    token = serializers.CharField()
    
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'
        read_only_fields = ['user']
        
        