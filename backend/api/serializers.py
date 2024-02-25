from rest_framework import serializers
from app.models import Order
from django.contrib.auth.models import User


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = "__all__"

    class create:
        model = Order
        fields = "__all__"

        def create(self, validated_data):
            return Order.objects.create(**validated_data)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
