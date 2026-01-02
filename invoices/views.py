from rest_framework import viewsets, permissions, generics, status
from .models import Client, Invoice, InvoiceItem, UserProfile
from .serializers import ( ClientSerializer, InvoiceItemSerializer, InvoiceSerializer,  
                PasswordRestConfirmSerializer, PasswordRestRequrestSerializer, 
                UserProfileSerializer
)
from django.http import HttpResponse
from django.template.loader import get_template
from xhtml2pdf import pisa
from rest_framework.decorators import action
from django.shortcuts import render, get_object_or_404
from rest_framework.permissions import IsAuthenticated, AllowAny 
from .serializers  import UserSerializer
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from rest_framework.response import Response


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
        try: 
            profile = User.objects.get(user=invoice.user)
        except UserProfile.DoesNotExist:
            profile = None
            
        template_path = 'invoices/pdf_template.html'
        context = {'invoice': invoice, 'profile': profile}
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
    
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserSerializer
    
    

class PasswordRestRequestView(generics.GenericAPIView):
    serializer_class = PasswordRestRequrestSerializer
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)    
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({"error": "user with this email does not exist."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Token aur UID generate karo
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            
            # yeh Link Frontend per show hoga... Broweser mein
            reset_link = f"http://localhost:5173/reset-password/{uid}/{token}"
            
            send_mail(
                'Password Rest Request',
                f'Click the link reset your password {reset_link}',
                'admin@saasinvoice.com',
                [email],
                fail_silently=False
            )
            return Response({'message': "password reset link sent to email. "}, status=status.HTTP_200_OK)
        return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)
        
class PasswordRestConfirmationView(generics.CreateAPIView):
    serializer_class = PasswordRestConfirmSerializer
    permission_classes = [ AllowAny]
    
    def post(self, request):
        serializer = self.get_serializer(data = request.data)
        if serializer.is_valid():
            uid = serializer.validated_data['uid']
            token =  serializer.validated_data['token']
            new_password = serializer.validated_data['new_password']
            
            try:
                user_id = force_str(urlsafe_base64_decode(uid))
                user = User.objects.get(pk=user_id)
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                return Response({'error': 'invalid UID'}, status=status.HTTP_400_BAD_REQUEST)
            if default_token_generator.check_token(user, token):
                user.set_password(new_password)
                user.save()
                return Response({'message': 'password has been changed successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'invalid aur expired token'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)
            
class UserProfileView(generics.CreateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile