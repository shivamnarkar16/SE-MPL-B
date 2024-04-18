import { BadgeCheck, BadgeX } from "lucide-react";
import { TableBody, TableRow, TableCell } from "./ui/table";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Tooltip, TooltipProvider } from "./ui/tooltip";
import { TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";
import { Button } from "./ui/button";
import { request } from "@/lib/Request";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";
import Loading from "./Loading";

const OrderItem = ({ setLoading, updateOrder, ...order }) => {
  const updateProcess = async (order: any) => {
    try {
      request({
        method: "PUT",
        url: `updateOrder/${order.id}`,
      })
        .then((response) => {
          console.log(response);
          updateOrder();
          setLoading(true);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <TooltipProvider>
      <TableBody className="w-full ">
        <TableRow>
          <TableCell className="font-medium">{order.id}</TableCell>
          <Tooltip>
            <TableCell>
              <TooltipTrigger>
                {order.paid || order.captured ? (
                  <>
                    <BadgeCheck className="dark:text-green-500 text-green-600" />
                    <TooltipContent className="p-2 bg-black rounded-xl">
                      Paid
                    </TooltipContent>
                  </>
                ) : (
                  <>
                    <BadgeX className="dark:text-rose-500 text-rose-600" />
                    <TooltipContent className="p-2 bg-black rounded-xl">
                      Not Paid
                    </TooltipContent>
                  </>
                )}
              </TooltipTrigger>
            </TableCell>
          </Tooltip>
          <TableCell>
            {order.price &&
              new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(order.price / 100)}
            {order.amount &&
              new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(order.amount / 100)}
          </TableCell>
          {order.method && <TableCell className="">{order.method}</TableCell>}
          <TableCell className="">{order.payment_id || order.status}</TableCell>
          {order.process === false && order.paid && (
            <TableCell className="text-right">
              <Button
                variant={"secondary"}
                onClick={() => updateProcess(order)}
              >
                Approve
              </Button>
            </TableCell>
          )}
        </TableRow>
      </TableBody>
    </TooltipProvider>
  );
};

export default OrderItem;
