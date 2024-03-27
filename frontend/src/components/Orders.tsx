import { useEffect, useState } from "react";
import { Order } from "./Order";
import { request } from "@/lib/Request";
import { useUserContext } from "@/context/User";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { ArrowRightCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import useRazorpay from "react-razorpay";
import food from "@/assets/food.jpg";

interface OrderType {
  id: number;
  name: string;
  description: string;
  price: number;
  imageId: string;
  isVeg: boolean;
  table?: number;
}

const Orders = () => {
  const [orderss, setOrderss] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [Razorpay] = useRazorpay();

  // const { orders } = useUserContext();

  useEffect(() => {
    // console.log(orders);
    if (localStorage.getItem("access_token") === null) {
      window.location.href = "/login";
    } else {
      (async () => {
        try {
          const { data } = await request({
            method: "GET",
            url: "orders",
            headers: { "Content-Type": "application/json" },
          });
          setOrderss(data.data);
        } catch (e) {
          console.log("not auth");
        }
      })();
    }
  }, []);
  const updateOrders = async () => {
    try {
      const { data } = await request({
        method: "GET",
        url: "orders",
        headers: { "Content-Type": "application/json" },
      });
      setOrderss(data.data);
    } catch (e) {
      console.log("not auth");
    }
  };
  const deleteOrder = async (order) => {
    await request({
      method: "DELETE",
      url: `orders/${order.id}`,
      headers: { "Content-Type": "application/json" },
    }).then((repsonse) => {
      setLoading(true);

      console.log(repsonse.data);
      updateOrders();
    });
  };
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 4000);
    window.scrollTo(0, 0);
  }, [loading]);
  console.log(orderss);
  const totalPrice =
    orderss.length > 0 &&
    orderss.map((order: OrderType) => order.price).reduce((a, b) => a + b) /
      100;
  const gst = (totalPrice as number) * 0.1;
  const grossed = (totalPrice as number) + gst;

  const complete_payment = (
    orderid: string,
    paymentid: string,
    sign: string
  ) => {
    request({
      method: "POST",
      url: "transaction",
      headers: { "Content-Type": "application/json" },
      data: {
        payment_id: paymentid,
        order_id: orderid,
        signature: sign,
        amount: parseInt(grossed),
      },
    })
      .then((response: any) => {
        console.log(response.data);
        setOrderss([]);
        setLoading(true);
        // updateOrders();
        // navigate("/success");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const checkOut = () => {
    request({
      method: "POST",
      url: "razorpay",
      headers: { "Content-Type": "application/json" },
      data: { amount: parseFloat(grossed.toExponential(5)), currency: "INR" },
    })
      .then((response) => {
        console.log(response);
        const order_id = response.data.id;
        const options = {
          key: "rzp_test_ayUd0ehWxUbVZE", // Enter the Key ID generated from the Dashboard
          amount: "505050", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: "INR",
          name: "CraveWave",
          description: "Test Transaction",
          image:
            "https://www.adobe.com/content/dam/cc/us/en/creativecloud/design/discover/mascot-logo-design/mascot-logo-design_fb-img_1200x800.jpg",
          order_id: order_id, //This is a sample Order ID. Pass the `id` obtained in the response of createOrder().
          handler: function (response: any) {
            console.log(response);
            complete_payment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
          },
          prefill: {
            name: "Shivam",
            email: "contact@cravewave.com",
            contact: "9999999999",
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#010101",
          },
        };

        const rzp1 = new Razorpay(options);

        rzp1.on("payment.failed", function (response) {
          alert(response.error.code);
          alert(response.error.description);
          alert(response.error.source);
          alert(response.error.step);
          alert(response.error.reason);
          alert(response.error.metadata.order_id);
          alert(response.error.metadata.payment_id);
        });

        rzp1.open();
        // updateOrders();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="flex w-full h-screen items-center justify-evenly flex-col lg:flex-row  ">
      <div className="flex flex-col  items-center  max-w-full p-4">
        <ScrollArea className=" md:h-[80svh] h-[60svh]">
          {orderss.length ? (
            orderss?.map((order: OrderType) => (
              <Order order={order} key={order.id} deleteOrder={deleteOrder} />
            ))
          ) : (
            <div className="h-full flex flex-col space-y-10 justify-center items-center w-full">
              <h1>No Orders Found</h1>
              <Button
                onClick={() => navigate("/dashboard")}
                className="space-x-2"
              >
                <p>Go to Menu</p>
                <ArrowRightCircle />
              </Button>
            </div>
          )}
        </ScrollArea>
      </div>
      {/* <Order order={orders} key={orders.id} /> */}
      {/* Summary of order price */}
      {orderss.length > 0 && (
        <div className="flex justify-center  flex-col h-auto w-full lg:w-auto    items-center border p-8">
          <div className="flex flex-col space-y-1 ">
            <h1 className="text-3xl font-bold p-3 border-b-2 mb-3">
              Order Summary
            </h1>
            {orderss.length > 0 && (
              <div className="flex flex-col p-4">
                <div className="flex">
                  <h1 className="text-xl font-medium">Total Price : </h1>
                  <h1 className="text-xl font-light text-gray-500 px-2 ">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(totalPrice as number)}
                  </h1>
                </div>
                <div className="flex">
                  <h1 className="text-xl font-medium">GST : </h1>
                  <h1 className="text-xl font-light px-2 ">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                    }).format(gst)}
                  </h1>
                </div>
              </div>
            )}
          </div>
          <hr className="m-3 border w-full border-dashed" />

          <div className="flex">
            <h1 className="text-2xl font-bold">Total : </h1>
            <h1 className="text-2xl font-bold px-2 ">
              {totalPrice
                ? new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(grossed)
                : "0"}
            </h1>
          </div>
          <Button className="mt-5 w-full" onClick={checkOut}>
            Checkout
          </Button>
        </div>
      )}
    </div>
  );
};

export default Orders;
