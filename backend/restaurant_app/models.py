from django.db import models
from django.utils import timezone

class Location(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.name

class MenuItem(models.Model):
    location = models.ForeignKey(Location, related_name='menu_items', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    category = models.ForeignKey('Category', related_name='items', null=True, blank=True, on_delete=models.SET_NULL)
    image_url = models.CharField(max_length=400, blank=True)
    available = models.BooleanField(default=True)
    bestseller = models.BooleanField(default=False)
    recommended = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.location.name})"


class Category(models.Model):
    name = models.CharField(max_length=120)
    image_url = models.CharField(max_length=400, blank=True)

    def __str__(self):
        return self.name


class Staff(models.Model):
    ROLE_CHOICES = [
        ('admin','Admin'),
        ('manager','Manager'),
        ('kitchen','Kitchen Staff'),
        ('delivery','Delivery Staff'),
        ('cashier','Cashier'),
        ('waiter','Waiter / Waitress'),
        ('cleaner','Housekeeping / Cleaner'),
    ]
    name = models.CharField(max_length=120)
    role = models.CharField(max_length=40, choices=ROLE_CHOICES, default='kitchen')
    phone = models.CharField(max_length=30, blank=True)
    email = models.EmailField(blank=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2, default=0, null=True, blank=True)
    account_number = models.CharField(max_length=50, blank=True)
    profile_picture = models.CharField(max_length=500, blank=True)
    address = models.TextField(blank=True)
    active = models.BooleanField(default=True)
    joined_date = models.DateField(null=True, blank=True)
    location = models.ForeignKey(Location, null=True, blank=True, on_delete=models.SET_NULL)
    password = models.CharField(max_length=128, blank=True)

    def __str__(self):
        return f"{self.name} ({self.role})"


class StaffAttendance(models.Model):
    staff = models.ForeignKey(Staff, related_name='attendances', on_delete=models.CASCADE)
    date = models.DateField()
    present = models.BooleanField(default=True)
    start_time = models.DateTimeField(null=True, blank=True)
    shift = models.CharField(max_length=50, blank=True)
    note = models.CharField(max_length=255, blank=True)

    class Meta:
        unique_together = ('staff','date')

    def __str__(self):
        return f"{self.staff.name} - {self.date} - {'P' if self.present else 'A'}"


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending','Pending'),
        ('confirmed','Confirmed'),
        ('completed','Completed'),
        ('cancelled','Cancelled'),
    ]
    order_id = models.CharField(max_length=64, unique=True)
    customer_name = models.CharField(max_length=200)
    customer_email = models.EmailField(blank=True)
    total_amount = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='pending')
    location = models.ForeignKey(Location, null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.order_id} - {self.customer_name}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    menu_item = models.ForeignKey(MenuItem, null=True, blank=True, on_delete=models.SET_NULL)
    name = models.CharField(max_length=200)
    qty = models.IntegerField(default=1)
    unit_price = models.DecimalField(max_digits=8, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.name} x{self.qty} ({self.order.order_id})"


class Coupon(models.Model):
    TYPE_CHOICES = [
        ('percent', 'Percent Off'),
        ('flat', 'Flat Amount Off'),
    ]
    code = models.CharField(max_length=30, unique=True)
    description = models.CharField(max_length=255, blank=True)
    discount_type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='percent')
    discount_value = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    min_order_amount = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    max_discount = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    expiry_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.code} ({self.discount_type}: {self.discount_value})"


class Grocery(models.Model):
    CATEGORY_CHOICES = [
        ('vegetables', 'Vegetables & Greens'),
        ('dairy', 'Dairy & Milk Products'),
        ('grains', 'Rice, Flour & Grains'),
        ('meat', 'Meat, Chicken & Seafood'),
        ('spices', 'Spices & Masalas'),
        ('oil', 'Oil & Ghee'),
        ('packaging', 'Packaging & Container'),
        ('other', 'Other Groceries'),
    ]

    item_name = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='other')
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    unit = models.CharField(max_length=30, default='kg')
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    purchased_date = models.DateField(default=timezone.now)
    purchased_by = models.CharField(max_length=100, blank=True)
    payment_mode = models.CharField(max_length=50, default='Cash')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.item_name} ({self.quantity}{self.unit} - ₹{self.price})"


