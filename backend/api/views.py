from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from app.models import Order
from django.http import JsonResponse
from .serializers import OrderSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
import json
from django.contrib.auth.models import User


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def orderData(request):
    user = request.user
    products = Order.objects.filter(userId=user)
    return JsonResponse({"data": list(products.values())}, safe=False)

    # serializer = OrderSerializer(products, many=True)
    # return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def createOrder(request):
    data = request.data
    user = request.user

    # json_data = json.dumps(data)
    # for key, value in data.items():
    #     print(key, value)
    # print(data["order"][0].get("name"))
    # return Response({"message": "Successfully"})
    try:
        isVeg = False

        with open("order.json", "w") as f:
            json.dump(data, f)

        for i in data["order"]:
            price = 0
            if i.get("price"):
                price = i.get("price")
            elif i.get("defaultPrice"):
                price = i.get("defaultPrice")
            else:
                price = 0
            if i.get("itemAttribute").get("vegClassifier") == "VEG":
                isVeg = True
            else:
                isVeg = False
            order = Order.objects.create(
                foodId=i.get("id"),
                name=i.get("name"),
                category=i.get("category"),
                isVeg=isVeg,
                price=price,
                quantity=i.get("quantity"),
                imageId=i.get("imageId"),
                userId=user,
                # "userId": user.id,
            )
            order.save()
        return Response({"message": "Successfully"})

    except Exception as e:
        print(e)
        return Response(
            {"message": "Error Occured"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET"])
# @permission_classes([IsAuthenticated])
def getUserDetails(request):
    user = request.user
    return Response(
        {
            "username": user.username,
            "email": user.email,
            "id": user.id,
            "isSuperUser": user.is_superuser,
        }
    )


@api_view(["DELETE"])
def deleteOrder(request, pk):
    try:
        order = Order.objects.get(id=pk)
        order.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Order.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def createUser(request):
    data = request.data
    try:
        user = User.objects.create_user(
            data["username"], data["email"], data["password"]
        )
        user.save()
        if not user:
            raise Exception("something went wrong with the DB!")
        return Response({"message": "Successfully"})
    except:
        return Response(
            {"message": "Error Occured"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
# @permission_classes([IsAuthenticated])
def logout(request):
    try:
        refresh_token = request.data["refresh_token"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response(status=status.HTTP_205_RESET_CONTENT)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)
