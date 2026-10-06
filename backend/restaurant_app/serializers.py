from rest_framework import serializers
from .models import Location, MenuItem, Category
from .models import Staff, StaffAttendance
from .models import Order, OrderItem
from .models import Coupon, Grocery

class MenuItemSerializer(serializers.ModelSerializer):
    image_url = serializers.CharField(max_length=500000, required=False, allow_blank=True)

    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'description', 'price', 'location', 'category', 'image_url', 'available', 'bestseller', 'recommended', 'is_active']


class CategorySerializer(serializers.ModelSerializer):
    image_url = serializers.CharField(max_length=500000, required=False, allow_blank=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'image_url']


class StaffAttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffAttendance
        fields = ['id','staff','date','present','start_time','shift','note']


class StaffSerializer(serializers.ModelSerializer):
    attendances = StaffAttendanceSerializer(many=True, read_only=True)
    password = serializers.CharField(write_only=True, required=False)
    class Meta:
        model = Staff
        fields = ['id','name','role','phone','email','salary','account_number','profile_picture','address','active','joined_date','location','password','attendances']

class LocationSerializer(serializers.ModelSerializer):
    menu_items = MenuItemSerializer(many=True, read_only=True)

    class Meta:
        model = Location
        fields = ['id', 'name', 'address', 'menu_items']


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id','order','menu_item','name','qty','unit_price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    class Meta:
        model = Order
        fields = ['id','order_id','customer_name','customer_email','total_amount','status','location','created_at','items']


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ['id','code','description','discount_type','discount_value','min_order_amount','max_discount','expiry_date','is_active','created_at']


class GrocerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Grocery
        fields = ['id', 'item_name', 'category', 'quantity', 'unit', 'price', 'purchased_date', 'purchased_by', 'payment_mode', 'notes', 'created_at']

