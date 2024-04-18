import React from "react";
import { Button } from "./ui/button";

const Success = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-4xl font-bold">Order Placed Successfully</h1>
        <p className="text-lg">Thank you for ordering with us</p>
        <p className="text-lg">Your order will be delivered shortly</p>
        <Button className="">Back to Dashboard</Button>
      </div>
    </div>
  );
};

export default Success;
