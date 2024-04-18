import { useEffect, useState } from "react";
import OrderItem from "./OrderItem";
import { ScrollArea } from "./ui/scroll-area";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { request } from "@/lib/Request";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Loading from "./Loading";

const AdminPanel = () => {
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request({
      method: "GET",
      url: "allorders",
    })
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const allOrders = async () => {
    await request({
      method: "GET",
      url: "allorders",
    })
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    request({
      method: "GET",
      url: "payments",
    })
      .then((response) => {
        const data = response.data;
        const items = data.items.map((item: any) => {
          return {
            ...item,
            id: item.id,
            amount: item.amount,
          };
        });
        setPayments(items);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 4000);
  }, []);

  useEffect(() => {
    allOrders();
    setLoading(false);
  }, [loading]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="pt-24 p-10 flex flex-col space-y-10 md:h-screen h-full">
      <div className="graph md:h-1/2 h-[40vh] ">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart width={150} height={40} data={payments}>
            <Bar dataKey="amount" fill="#e5e5e5" />
            <Tooltip
              cursor={{
                stroke: "white",
                strokeWidth: 2,
                fill: "black",
                fillOpacity: 0.5,
              }}
              content={function (props: any) {
                return (
                  <div className="bg-slate-800 p-2 text-white">
                    <p>Method : {props.payload[0]?.payload?.method}</p>
                    <p>
                      Amount :
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(props.payload[0]?.payload?.amount / 100)}
                    </p>
                  </div>
                );
              }}
            />

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={"method"} />

            <YAxis dataKey={"amount"} />

            <Legend />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex md:flex-row flex-col md:h-1/2 w-full">
        <div className="p-5 md:w-1/2 border  rounded-lg mx-4 ">
          <h1 className="text-xl font-bold p-2 border-b-2">Orders</h1>
          <Table>
            <ScrollArea className="h-[300px] p-4 ">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Payment ID</TableHead>
                  <TableHead className="text-right">Process ?</TableHead>
                </TableRow>
              </TableHeader>
              {orders?.data?.length > 0 &&
                orders?.data.map((order: any) => {
                  return (
                    <OrderItem
                      key={order.id}
                      {...order}
                      updateOrder={allOrders}
                      setLoading={setLoading}
                    />
                  );
                })}
            </ScrollArea>
          </Table>
        </div>
        <div className="payments p-5 md:w-1/2 md:my-0 my-10 border rounded-lg">
          <h1 className="text-xl font-bold p-2 border-b-2">Payments</h1>
          <Table>
            <ScrollArea className="h-[300px] p-4">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Process Status</TableHead>
                </TableRow>
              </TableHeader>
              {payments?.length > 0 &&
                payments?.map((item: any) => {
                  return <OrderItem key={item.id} {...item} />;
                })}
            </ScrollArea>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
