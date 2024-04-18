from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from app.models import Order, Profile
from django.http import JsonResponse
from .serializers import CreateOrderSerializer, TransactionSerailzer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
import json
from django.contrib.auth.models import User
from django.dispatch import receiver
from api.razorpay.main import RazorPayClient
import requests

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
    profile = request.user.profile
    return Response(
        {
            "username": profile.user.username,
            "email": profile.user.email,
            "address": profile.address,
            "id": profile.user.id,
            "is_superuser": profile.user.is_superuser,
            "city": profile.city,
            "latitude": profile.latitude,
            "longitude": profile.longitude,
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


@api_view(["POST"])  # or any other HTTP method you prefer
def create_user_profile_api(request):
    if request.method == "POST":
        data = request.data
        # Logic for creating a user profile when a User object is created
        # This function will be called whenever a User object is saved
        try:
            user = User.objects.create(username=data["username"], email=data["email"])
            user.set_password(data["password"])
            user.save()

            # Create a profile for the user
            profile = Profile.objects.create(user=user)
            address = data["city"]
            profile.address = data["address"]
            profile.city = data["city"]
            if address:
                # Make a request to the Nominatim API
                response = requests.get(
                    "https://nominatim.openstreetmap.org/search",
                    params={"q": address, "format": "json"},
                )

                if response.status_code == 200:
                    data = response.json()
                    if data:
                        # Extract latitude and longitude from the response
                        latitude = float(data[0]["lat"])
                        longitude = float(data[0]["lon"])
                        profile.latitude = latitude
                        profile.longitude = longitude
                        profile.save()
                        return JsonResponse(
                            {"message": "Registered Successful"}, safe=False, status=201
                        )
                        print(latitude, longitude)
                    else:
                        return JsonResponse(
                            {"error": "No results found for the provided address"},
                            status=400,
                        )
                else:
                    return JsonResponse(
                        {"error": "Failed to retrieve geocoding data"}, status=500
                    )
            else:
                return JsonResponse(
                    {"error": "Address parameter is missing"}, status=400
                )

            # Return a success response

        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
# @permission_classes([IsAuthenticated])
def logout(request):
    try:
        refresh_token = request.data["refresh_token"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response(status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


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


@api_view(["GET"])
def getAllOrders(request):
    try:
        orders = Order.objects.all()
        return JsonResponse({"data": list(reversed(orders.values()))}, safe=False)

    except Exception as e:
        return Response(
            {"message": "Error Occured : " + str(e)}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET"])
def getAllPayments(request):
    try:
        payments = rz_client.get_all_payments()
        return Response(payments, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"message": "Error Occured : " + str(e)}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET"])
def get_payment_details():
    # Logic for fetching payment details
    return "Payment details"


@api_view(["PUT"])
def updateOrderStatus(request, pk):
    try:
        order = Order.objects.get(id=pk)
        order.process = True
        order.save()
        return Response({"message": "Successfully"})
    except Exception as e:
        return Response(
            {"message": "Error Occured : " + str(e)}, status=status.HTTP_400_BAD_REQUEST
        )


def track_order(input_text):
    # Logic for tracking order status
    return "Order status"


@api_view(["POST"])
# Send a GET request to the URL
def chatbot(request):
    data = request.data
    # url = "https://instafood-server-7ayg.vercel.app/api/restaurants?lat=12.9351929&lng=77.62448069999999"
    url = data["url"]
    # print(data["action"])
    action = data["action"]
    finalRestaurant = []

    response = requests.get(url)
    if response.status_code == 200:
        restaurants_data = json.loads(response.text)["data"]["cards"][1]["card"][
            "card"
        ]["gridElements"]["infoWithStyle"]["restaurants"]
        # print(restaurants_data)
    else:
        print("Failed to fetch data:", response.status_code)

    def get_restaurant_details(name):

        for restaurant in restaurants_data:
            restaurant_name = restaurant["info"]["name"].lower()
            if restaurant_name.startswith(name.lower()):
                print("GET Request ")
                return restaurant["info"]
        return None

    while True:
        if data["action"] == "hello":
            return JsonResponse({"message": "Hello how r u ? Fine thank you"})
        elif data["action"] == "bye":
            return JsonResponse({"message": "Good Bye! Have a nice day"})
            break

        elif data["action"] == "get_restaurant":
            restaurant = get_restaurant_details(data["message"])
            if restaurant:
                print("GET Restaurant: ")
                return JsonResponse(restaurant, safe=False)
            else:
                return JsonResponse("Restaurant not found.", safe=False)
        elif action == "get_all_restaurants":
            for restaurant in restaurants_data:
                restaurants_datas = {
                    "id": restaurant["info"]["id"],
                    "name": restaurant["info"]["name"],
                    "locality": restaurant["info"]["locality"],
                    "areaName": restaurant["info"]["areaName"],
                    "cuisines": restaurant["info"]["cuisines"],
                    "avgRating": restaurant["info"]["avgRating"],
                    "totalRatingsString": restaurant["info"]["totalRatingsString"],
                    "slaString": restaurant["info"]["sla"]["slaString"],
                    "lastMileTravelString": restaurant["info"]["sla"][
                        "lastMileTravelString"
                    ],
                }
                finalRestaurant.append(restaurants_datas)
                print(finalRestaurant)

            return JsonResponse(finalRestaurant, safe=False)
        else:
            return JsonResponse(
                "Sorry, I couldn't understand your request.", safe=False
            )
