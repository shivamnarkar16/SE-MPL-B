import { Star } from "lucide-react";
import { Badge } from "./ui/badge";
import { IMG_CDN_URL } from "@/lib/Constants";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { Suspense } from "react";
import Loading from "./Loading";

const RestaurantCard = ({ restaurants }: { restaurants: any }) => {
  return (
    <div>
      <div
        className="flex flex-wrap w-[32svh]  h-[420px] justify-between  md:w-[400px] p-4 border md:m-4 rounded flex-col my-2 hover:bg-gray-300 dark:hover:bg-gray-800 ease-in transition-all cursor-pointer"
        key={restaurants?.id}
      >
        <Suspense fallback={<Loading />}>
          <img
            className="w-full h-1/2 object-cover  rounded-lg align-middle"
            src={IMG_CDN_URL + restaurants?.cloudinaryImageId}
          />
        </Suspense>
        <h1 className=" font-bold text-wrap ">{restaurants?.name}</h1>
        <h1 className=" text-xs text-slate-600 dark:text-slate-400 font-light  ">
          {restaurants?.locality} , {restaurants?.areaName}
        </h1>

        <div className="flex justify-between w-full ">
          <div className="space-x-3 flex ">
            {restaurants?.avgRating < 4.0 ? (
              <h4 className=" text-sm p-1 bg-rose-500 dark:bg-rose-600 text-white font-medium rounded-md">
                ⭐ <span className="px-1">{restaurants?.avgRating}</span>
              </h4>
            ) : (
              <h4 className=" text-sm p-1  bg-green-500 dark:bg-green-800 text-white font-medium rounded-md">
                ⭐ <span className="px-1">{restaurants?.avgRating}</span>
              </h4>
            )}
          </div>
          {restaurants?.availability.opened ? (
            <Badge className="dark:bg-green-800 dark:text-white bg-green-600">
              Open
            </Badge>
          ) : (
            <Badge className="bg-rose-500 dark:text-white">Close</Badge>
          )}
        </div>
        <h4 className="heading text-sm justify-center text-black dark:text-slate-600 font-bold m-1.5 ">
          {" "}
          {restaurants?.costForTwo ?? "₹200 for two"}
        </h4>
        <Link to={`/restaurant/${restaurants?.id}`} className=" self-end">
          <Button>Check out</Button>
        </Link>
      </div>
    </div>
  );
};

export default RestaurantCard;
