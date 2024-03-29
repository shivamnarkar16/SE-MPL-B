from django.db import models
import uuid
from django.contrib.auth.models import User


# Create your models here.
class Order(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    foodId = models.CharField(max_length=200, null=True)
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=200)
    isVeg = models.BooleanField(default=False)
    price = models.IntegerField()
    restaurantId = models.CharField(max_length=200, default="")
    quantity = models.IntegerField()
    imageId = models.CharField(max_length=200)
    userId = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    paid = models.BooleanField(default=False)
    payment_id = models.CharField(max_length=200, null=True)

    def __iter__(self):
        return iter(
            [
                self.foodId,
                self.name,
                self.category,
                self.isVeg,
                self.restaurantId,
                self.price,
                self.quantity,
                self.imageId,
                self.userId,
                self.paid,
            ]
        )


class Transaction(models.Model):
    payment_id = models.CharField(max_length=200, verbose_name="Payment ID")
    order_id = models.CharField(max_length=200, verbose_name="Order ID")
    signature = models.CharField(
        max_length=500, verbose_name="Signature", blank=True, null=True
    )
    amount = models.IntegerField(verbose_name="Amount")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.id)


class OrderUpdates(models.Model):
    order_id = models.ForeignKey(Order, on_delete=models.CASCADE)
    status = models.CharField(max_length=200, verbose_name="Status")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.id)
