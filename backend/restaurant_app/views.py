from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum, Count
from django.db.models.functions import TruncDay, TruncMonth
from .models import Location, MenuItem, Category, Staff, StaffAttendance, Order, OrderItem, Coupon, Grocery
from .serializers import LocationSerializer, MenuItemSerializer, CategorySerializer, StaffSerializer, StaffAttendanceSerializer, OrderSerializer, OrderItemSerializer, CouponSerializer, GrocerySerializer
from django.utils import timezone
from django.contrib.auth.hashers import make_password, check_password

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer


class StaffAttendanceViewSet(viewsets.ModelViewSet):
    queryset = StaffAttendance.objects.all()
    serializer_class = StaffAttendanceSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer


class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer


class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all().order_by('-created_at')
    serializer_class = CouponSerializer


class GroceryViewSet(viewsets.ModelViewSet):
    queryset = Grocery.objects.all().order_by('-purchased_date', '-created_at')
    serializer_class = GrocerySerializer



class DashboardAPIView(APIView):
    def get(self, request):
        # Basic aggregates
        total_orders = Order.objects.count()
        today_orders = Order.objects.filter(created_at__date__exact=__import__('datetime').date.today()).count()
        status_counts = Order.objects.values('status').annotate(count=Count('id'))
        pending = Order.objects.filter(status='pending').count()
        completed = Order.objects.filter(status='completed').count()
        cancelled = Order.objects.filter(status='cancelled').count()
        total_customers = Order.objects.values('customer_email').distinct().count()
        today = __import__('datetime').date.today()
        today_revenue = Order.objects.filter(created_at__date__exact=today).aggregate(total=Sum('total_amount'))['total'] or 0
        monthly_revenue = Order.objects.filter(created_at__month=today.month).aggregate(total=Sum('total_amount'))['total'] or 0

        # Staff attendance metrics
        total_employee = Staff.objects.count()
        todayspresent = StaffAttendance.objects.filter(date=today, present=True).count()
        Absent = StaffAttendance.objects.filter(date=today, present=False).count()
        LateComing = StaffAttendance.objects.filter(date=today, present=True, start_time__hour__gte=10).count()
        leave = StaffAttendance.objects.filter(date=today, present=False, note__icontains='leave').count()

        # Sales series (monthly by default)
        sales_monthly = list(Order.objects.annotate(month=TruncMonth('created_at')).values('month').annotate(total=Sum('total_amount')).order_by('month'))

        # Most ordered items
        top_items = OrderItem.objects.values('name').annotate(qty=Sum('qty')).order_by('-qty')[:6]

        data = {
            'total_orders': total_orders,
            'today_orders': today_orders,
            'status_counts': {s['status']: s['count'] for s in status_counts},
            'pending': pending,
            'completed': completed,
            'cancelled': cancelled,
            'total_customers': total_customers,
            'today_revenue': float(today_revenue),
            'monthly_revenue': float(monthly_revenue),
            'sales_monthly': [{ 'month': x['month'].strftime('%Y-%m'), 'total': float(x['total'] or 0) } for x in sales_monthly],
            'top_items': list(top_items),
            'total_employee': total_employee,
            'todayspresent': todayspresent,
            'Absent': Absent,
            'LateComing': LateComing,
            'leave': leave,
        }
        return Response(data)


class StartWorkAPIView(APIView):
    """API endpoint to mark staff start work (check-in).

    POST payload: {"staff": <staff_id>}
    If attendance for today does not exist, it will be created.
    If start_time is not set, it will be populated with current server time.
    """
    def post(self, request):
        staff_id = request.data.get('staff')
        if not staff_id:
            return Response({'detail':'staff id required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            staff = Staff.objects.get(pk=staff_id)
        except Staff.DoesNotExist:
            return Response({'detail':'staff not found'}, status=status.HTTP_404_NOT_FOUND)

        today = timezone.localdate()
        attendance, created = StaffAttendance.objects.get_or_create(staff=staff, date=today, defaults={'present': True})
        if not attendance.start_time:
            attendance.start_time = timezone.now()
            attendance.present = True
            attendance.save()

        serializer = StaffAttendanceSerializer(attendance)
        return Response(serializer.data)


class RegisterAPIView(APIView):
    def post(self, request):
        data = request.data
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'kitchen')
        phone = data.get('phone', '')
        location = data.get('location', None)

        if email and Staff.objects.filter(email=email).exists():
            return Response({'detail':'email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        staff = Staff.objects.create(
            name=name or '',
            role=role,
            phone=phone,
            email=email or '',
            active=True,
            location_id=location if location else None,
            password=make_password(password) if password else ''
        )
        serializer = StaffSerializer(staff)
        return Response(serializer.data)


class LoginAPIView(APIView):
    def post(self, request):
        data = request.data
        email = data.get('email')
        password = data.get('password')
        if not email or not password:
            return Response({'detail':'email and password required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            staff = Staff.objects.get(email=email)
        except Staff.DoesNotExist:
            return Response({'detail':'invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        if not staff.password:
            return Response({'detail':'no password set for this staff'}, status=status.HTTP_400_BAD_REQUEST)
        if not check_password(password, staff.password):
            return Response({'detail':'invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = StaffSerializer(staff)
        return Response(serializer.data)
