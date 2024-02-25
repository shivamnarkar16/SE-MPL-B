import { useEffect, useState } from "react";
import { Order } from "./Order";
import { request } from "@/lib/Request";
import { useUserContext } from "@/context/User";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

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
      console.log(repsonse.data);
      updateOrders();
    });
  };

  console.log(orderss);
  const totalPrice =
    orderss.length > 0 &&
    orderss.map((order: OrderType) => order.price).reduce((a, b) => a + b) /
      100;
  const gst = (totalPrice as number) * 0.18;
  const grossed = (totalPrice as number) + gst;
  return (
    <div className="flex w-full items-center justify-evenly flex-col lg:flex-row  ">
      <div className="flex flex-col  items-center  max-w-full p-4">
        <ScrollArea className="pt-24 h-[90svh]">
          {orderss.length ? (
            orderss?.map((order: OrderType) => (
              <Order order={order} key={order.id} deleteOrder={deleteOrder} />
            ))
          ) : (
            <h1>No Orders Found</h1>
          )}
        </ScrollArea>
      </div>
      {/* <Order order={orders} key={orders.id} /> */}
      {/* Summary of order price */}
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
        <Button className="mt-5 w-full">Checkout</Button>
      </div>
    </div>
  );
};

export default Orders;
