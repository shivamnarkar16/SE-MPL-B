from django.urls import path, include
from . import views
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    path("orders/", views.orderData),
    path("order/add/", views.createOrder),
    path("token/", jwt_views.TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", jwt_views.TokenRefreshView.as_view(), name="token_refresh"),
    path("logout/", views.logout, name="logout"),
    path("user/", views.getUserDetails, name="user"),
    path("register/", views.create_user_profile_api, name="Create User"),
    # path("sendOrder/", views.sendOrderData, name="OrderData"),
    path("orders/<str:pk>/", views.deleteOrder, name="OrderDetail"),
    path("razorpay/", views.payOrderView, name="RazorPay"),
    path("transaction/", views.transactionView, name="Transaction"),
    path("paid/", views.updatePaidOrders, name="PaidOrder"),
    path("allorders/", views.getAllOrders),
    path("payments/", views.getAllPayments),
    path("updateOrder/<str:pk>/", views.updateOrderStatus, name="UpdateOrder"),
    path("chats/", views.chatbot, name="ChatData"),
]
