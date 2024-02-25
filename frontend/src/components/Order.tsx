import { IMG_CDN_URL } from "@/lib/Constants";
import { cn } from "@/lib/utils";
import { Circle, Trash, Triangle } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { request } from "@/lib/Request";

interface Order {
  id: number;
  name: string;
  description: string;
  price: number;
  imageId: string;
  isVeg: boolean;
  table?: number;
}

export const Order = ({
  order,
  deleteOrder,
}: {
  order: Order;
  deleteOrder: any;
}) => {
  const [showmore, setShowmore] = useState(false);

  return (
    <div key={order.id} className="m-2">
      <div className="p-4 flex relative lg:flex-row rounded-lg  flex-col border mx-auto w-[50vw] justify-between ">
        <Button
          onClick={() => deleteOrder(order)}
          className="w-12 self-end right-2 top-2 bg-red-300 dark:bg-rose-900 dark:text-white h-12 absolute"
        >
          <Trash />
        </Button>

        <div className="p-4">
          <h1 className="font-bold lg:text-2xl text-xl flex-grow">
            {order.name}
          </h1>

          {/* <p className="text-slate-400 flex-grow py-4">
            {!showmore
              ? order.description.substring(0, 240)
              : order.description}
            <a
              onClick={() => setShowmore(!showmore)}
              className="px-3 cursor-pointer underline text-slate-400"
            >
              {order.description.length < 20
                ? ""
                : showmore
                ? "Show less"
                : "Show More"}
            </a>
          </p> */}
          <p className=" dark:text-slate-400 text-slate-800 font-bold py-3 text-2xl">
            {order?.price
              ? new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format((order?.price || order?.defaultPrice) / 100)
              : " "}
          </p>
          <p
            className={cn(
              "border  flex items-center m-3 justify-center w-4 h-4 lg:w-8 lg:h-8",
              order?.isVeg ? "border-green-500" : "border-red-600"
            )}
          >
            {order?.isVeg ? (
              <Circle
                className="text-green-500 h-2 w-2 lg:w-4 lg:h-4"
                fill="rgb(34 197 94)"
              />
            ) : (
              <Triangle
                className="text-rose-900 h-2 w-2 lg:w-4 lg:h-4 lg:m-2"
                fill="red"
              />
            )}
          </p>
        </div>

        {order?.imageId && (
          <img
            src={IMG_CDN_URL + order.imageId}
            className="p-4 rounded-[20%] w-[278px]"
          />
        )}
      </div>
    </div>
  );
};
