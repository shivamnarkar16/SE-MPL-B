from django.contrib import admin
from .models import Order, Transaction


admin.site.register(Order)
admin.site.register(Transaction)
