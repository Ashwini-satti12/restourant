from django.urls import path, include
from rest_framework import routers
from .views import LocationViewSet, MenuItemViewSet, CategoryViewSet, StaffViewSet, StaffAttendanceViewSet, OrderViewSet, OrderItemViewSet, DashboardAPIView, StartWorkAPIView, GroceryViewSet
from .views import RegisterAPIView, LoginAPIView

router = routers.DefaultRouter()
router.register(r'locations', LocationViewSet)
router.register(r'menuitems', MenuItemViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'staff', StaffViewSet)
router.register(r'staff_attendance', StaffAttendanceViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'orderitems', OrderItemViewSet)
router.register(r'groceries', GroceryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', DashboardAPIView.as_view()),
    path('staff/start_work/', StartWorkAPIView.as_view()),
    path('auth/register/', RegisterAPIView.as_view()),
    path('auth/login/', LoginAPIView.as_view()),
]

