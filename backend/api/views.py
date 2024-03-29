from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from app.models import Order
from django.http import JsonResponse
from .serializers import CreateOrderSerializer, TransactionSerailzer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
import json
from django.contrib.auth.models import User
from api.razorpay.main import RazorPayClient

rz_client = RazorPayClient()


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
                restaurantId=i.get("restaurantId"),
                # restaurntId=data["restaurant"].get("id"),
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


@api_view(["POST"])
def payOrderView(request):
    create_order_serializer = CreateOrderSerializer(data=request.data)
    if create_order_serializer.is_valid():
        order_response = rz_client.create_order(
            amount=request.data["amount"],
            currency=create_order_serializer.validated_data["currency"],
        )
        return Response(order_response, status=status.HTTP_201_CREATED)
    else:
        return Response(
            create_order_serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
def transactionView(request):
    try:
        transaction_serializer = TransactionSerailzer(data=request.data)
        if transaction_serializer.is_valid():
            rz_client.verify_payment(
                payment_id=transaction_serializer.validated_data["payment_id"],
                order_id=transaction_serializer.validated_data["order_id"],
                signature=transaction_serializer.validated_data["signature"],
            )
            transaction_serializer.save()
            response = {
                "status_code": status.HTTP_201_CREATED,
                "message": "Transaction Created Successfully",
                "data": transaction_serializer.data,
            }
            return Response(response, status=status.HTTP_201_CREATED)
        else:
            return Response(
                transaction_serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )
    except Exception as e:
        return Response(e, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def updatePaidOrders(request):
    try:
        data = request.data
        for i in data["orderId"]:
            order = Order.objects.get(id=i.get("order_id"))
            order.paid = True
            order.payment_id = i.get("transaction_id")
            order.save()
        print(data)
        return Response({"message": "Successfully"})
    except Exception as e:
        return Response(
            {"message": "Error Occured : " + e}, status=status.HTTP_400_BAD_REQUEST
        )


# order_Ns8YSuuR3yhFGW
