from . import client
from rest_framework.serializers import ValidationError
from rest_framework import status


class RazorPayClient:
    def create_order(self, amount, currency):

        data = {
            "amount": amount * 100,
            "currency": currency,
        }
        try:
            response = client.order.create(data=data)
            return response
        except Exception as e:
            raise ValidationError(
                {
                    "status_code": status.HTTP_400_BAD_REQUEST,
                    "message": "Error Occured",
                    "error": str(e),
                }
            )

    def verify_payment(self, payment_id, order_id, signature):
        try:
            response = client.utility.verify_payment_signature(
                {
                    "razorpay_payment_id": payment_id,
                    "razorpay_order_id": order_id,
                    "razorpay_signature": signature,
                }
            )
            return response
        except Exception as e:
            raise ValidationError(
                {
                    "status_code": status.HTTP_400_BAD_REQUEST,
                    "message": "Error Occured",
                    "error": e,
                }
            )

    def get_all_payments(self):
        try:
            response = client.payment.fetch_all()
            return response
        except Exception as e:
            raise ValidationError(
                {
                    "status_code": status.HTTP_400_BAD_REQUEST,
                    "message": "Error Occured",
                    "error": e,
                }
            )
