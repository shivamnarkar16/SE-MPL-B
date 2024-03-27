import { useNavigate, useParams, useSearchParams } from "react-router-dom"; // import useParams for read `resId`
import {
  // API_URL,
  IMG_CDN_URL,
  // ITEM_IMG_CDN_URL,
  MENU_ITEM_TYPE_KEY,
  RESTAURANT_TYPE_KEY,
} from "@/lib/Constants";
import useRestaurant from "@/lib/useRestaurant"; // imported custom hook useResMenuData which gives restaurant Menu data from swigy api
import { Circle, Loader2, Plus, Terminal, Triangle } from "lucide-react";
import { Badge } from "./ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "./ui/button";
import { useContext, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { User, useUserContext } from "@/context/User";
import { request } from "@/lib/Request";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import Loading from "./Loading";

const RestaurantMenu = () => {
  const { id } = useParams(); // call useParams and get value of restaurant id using object destructuring
  const [restaurant, menuItems] = useRestaurant({
    id,
    RESTAURANT_TYPE_KEY,
    MENU_ITEM_TYPE_KEY,
  });

  const [loading, setLoading] = useState(true);
  const { user, setOrdersData, orders } = useUserContext();
  const [order, setOrder] = useState([]);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 4000);
    window.scrollTo(0, 0);
  }, []);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    async () =>
      await request({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: order,
        url: "order/add",
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
  }, [order]);
  useEffect(() => {
    if (alert) {
      setTimeout(() => {
        setAlert(false);
      }, 3000);
    }
  });

  interface ItemType {
    id: string;
    name: string;
    price: number;
    defaultPrice: number;
    imageId: string;
    isBestseller: boolean;
    ratings: {
      aggregatedRating: {
        rating: number;
        ratingCountV2: number;
      };
    };
    itemAttribute: {
      vegClassifier: string;
    };
    description: string;
    quantity: number;
    restaurantId: string;
  }

  const [alert, setAlert] = useState(false);
  const handleOrder = (o: ItemType, restaurant: any) => {
    o.quantity = 1;
    // const restaurantId = window.location.pathname.split("/")[2];
    o.restaurantId = restaurant.id;

    if (order.length > 0) {
      const index = order.findIndex((x: ItemType) => x.id === o.id);
      if (index !== -1) {
        console.log(index);
        order[index].quantity += o.quantity;
        setOrder([...order]);
      } else {
        setOrder([...order, o]);
        console.log(order);
      }
    } else {
      console.log(o);
      order.push(o);
    }

    request({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: { order, user: user },
      url: "order/add",
    })
      .then((res) => {
        console.log(res);
        setAlert(true);
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(order);
  };

  // console.log(restaurant);

  return loading ? (
    <Loading />
  ) : !restaurant ? (
    <div className="h-screen w-full flex items-center justify-center">
      Restaurant Not Found :(
    </div>
  ) : (
    <div className=" min-h-screen  pt-[60px]  md:pt-[70px]">
      <div className=" flex md:flex-row flex-col md:h-full h-full w-full p-4 md:p-10 items-center justify-center align-middle overflow-y-hidden  dark:bg-slate-900 bg-gray-200  dark:text-cyan-50 ">
        {restaurant?.cloudinaryImageId && (
          <img
            className=" object-cover rounded-[10px] md:w-[300px] md:h-[300px]  h-[200px] w-[200px] mt-10   "
            src={IMG_CDN_URL + restaurant?.cloudinaryImageId}
            alt={restaurant?.name}
          />
        )}
        <div className=" flex flex-col m-5">
          <h2 className="font-extrabold text-2xl md:max-w-lg w-full text-opacity-70 ">
            {restaurant?.name}
          </h2>
          <h2 className="font-medium text-sm py-2 text-slate-700 dark:text-slate-400 md:max-w-lg w-full text-opacity-70 ">
            {restaurant?.areaName}
          </h2>
          <div className="space-x-3 py-3">
            {restaurant?.cuisines?.map((cuisine: any, index) => (
              <Badge
                key={cuisine}
                className={cn(
                  " text-cyan-50 w-auto",
                  index % 2 === 0
                    ? "bg-green-500 dark:bg-green-700 hover:bg-green-800 dark:hover:bg-green-900 "
                    : "bg-rose-500 dark:bg-rose-700 hover:bg-rose-800 dark:hover:bg-rose-900"
                )}
              >
                {cuisine}
              </Badge>
            ))}
          </div>
          <h3 className="text-md font-bold text-slate-400">
            Address :{" "}
            <span className="font-medium capitalize text-slate-500">
              {" "}
              {restaurant?.labels[1].message}
            </span>
          </h3>
        </div>
      </div>

      <div className="restaurant-menu-content flex justify-center m-4">
        <div className="menu-items-container mt-2 md:max-w-[800px] w-full">
          <div className="menu-title-wrap p-5">
            <h3 className="menu-title text-zinc-600 text-center">
              Recommended{" "}
            </h3>
            <p className=" mt-2 text-center   ">{menuItems?.length} ITEMS</p>
          </div>
          <ScrollArea className="flex justify-between h-svh md:h-[50svh] w-full md:p-4 md:px-10 border rounded-xl flex-col ">
            {menuItems ? (
              menuItems?.map((item: ItemType) => (
                <div
                  className="w-svh flex  md:flex-row flex-col justify-between space-x-5 border m-3 p-4 rounded-lg"
                  key={item?.id}
                >
                  {item?.imageId && (
                    <div className="w-full p-2 relative">
                      {item?.isBestseller && (
                        <Badge className="absolute m-3 bg-green-500">
                          Best Selling
                        </Badge>
                      )}
                      <img
                        className="object-contain bg-gray-100 w-full h-40 rounded-lg"
                        src={IMG_CDN_URL + item?.imageId}
                        alt={item?.name}
                      />
                    </div>
                  )}
                  <div className="flex flex-col w-full items-center md:items-start justify-center p-4">
                    <div className="menu-item-details  w-full">
                      <h3 className="item-title flex flex-initial overflow-hidden text-2xl font-bold">
                        {item?.name}
                      </h3>
                      <div className="flex justify-between items-center">
                        <p className="item-cost font-medium py-3">
                          {item?.price || item?.defaultPrice > 0
                            ? new Intl.NumberFormat("en-IN", {
                                style: "currency",
                                currency: "INR",
                              }).format(
                                (item?.price || item?.defaultPrice) / 100
                              )
                            : " "}
                        </p>
                        {item?.ratings.aggregatedRating.rating && (
                          <div className="flex space-x-2">
                            <p>⭐ {item?.ratings.aggregatedRating.rating}</p>
                            <p className="text-slate-600">
                              {" "}
                              ({item?.ratings.aggregatedRating.ratingCountV2})
                            </p>
                          </div>
                        )}
                        <p
                          className={cn(
                            "border  flex items-center m-3 justify-center w-4 h-4 md:w-8 md:h-8",
                            item?.itemAttribute?.vegClassifier === "VEG"
                              ? "border-green-500"
                              : "border-red-600"
                          )}
                        >
                          {item?.itemAttribute?.vegClassifier === "VEG" ? (
                            <Circle
                              className="text-green-500 h-2 w-2 md:w-4 md:h-4"
                              fill="rgb(34 197 94)"
                            />
                          ) : (
                            <Triangle
                              className="text-rose-900 h-2 w-2 md:w-4 md:h-4 md:m-2"
                              fill="red"
                            />
                          )}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="flex  text-gray-500 md:w-[40svh]">
                        {item?.description}
                      </div>
                    </div>
                    <div className="text-right w-full">
                      <Button
                        className="  justify-center my-2 bg-green-700 hover:bg-green-900 font-semibold text-white   text-end rounded-lg"
                        onClick={() => {
                          handleOrder(item, restaurant);
                        }}
                        type="submit"
                      >
                        {" "}
                        Add <Plus className="h-4 w-4 mx-1" />{" "}
                      </Button>
                    </div>
                  </div>
                  <hr className="md:h-1 md:my-8 m-2 bg-gray-200 border-0 dark:bg-gray-700"></hr>
                  {setOrdersData(order)}
                </div>
              ))
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <Loader2 className="animate-spin " />
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
      {alert && (
        <div className="fixed bottom-1 right-0 p-3">
          <Alert className="bg-green-800">
            <AlertTitle>Order Placed</AlertTitle>
            <AlertDescription>
              Your order has been placed successfully
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;
