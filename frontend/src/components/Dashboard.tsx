import { Suspense, useContext, useEffect, useState } from "react";
import RestaurantCard from "./RestaurantCard";
import { Check, ChevronsUpDown, SearchCheckIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import Loading from "./Loading";
import { BASE_API_URL, setURL } from "@/lib/Constants";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useUserContext } from "@/context/User";
import { Input } from "./ui/input";
import { filterData } from "@/lib/utils";
// import Navbar from "./Navbar";

const Dashboard = () => {
  const [allRestaurant, setAllRestaurant] = useState([]);
  const [filterdRestaurant, setFilterdRestaurant] = useState([]);

  const { user } = useUserContext();
  const [city, setCity] = useState(user?.city);
  const [latitude, setLatitude] = useState(user?.latitude || 19.076);
  const [longitude, setLongitude] = useState(user?.longitude || 72.8777);
  const [search, setSearch] = useState("");
  async function checkJsonData(jsonData: any) {
    for (let i = 0; i < jsonData?.data?.cards.length; i++) {
      const checkData =
        jsonData?.data?.cards[i]?.card?.card?.gridElements?.infoWithStyle
          ?.restaurants;

      if (checkData !== undefined) {
        return checkData;
      }
    }
  }

  useEffect(() => {
    const data = async () => {
      try {
        const json = await fetch(
          BASE_API_URL +
            `lat=${latitude}&lng=${longitude}&page_type=DESKTOP_WEB_LISTING`
        );
        setURL(
          `lat=${latitude}&lng=${longitude}&&submitAction=ENTER&restaurantId=`
        );

        const jsonData = await json.json();

        // was showing an error of data fatching because sometime data coming from cards[1] sometime cards[2] and different on other times so me make a function and check which value of i gives data in cards[i]

        // call the checkJsonData() function which return Swiggy Restaurant data
        const resData = await checkJsonData(jsonData);

        // update the state variable restaurants with Swiggy API data
        setAllRestaurant(resData);
        setFilterdRestaurant(resData);
        setIsLoading(false);
        // console.log(cityData);
      } catch (error) {
        console.log(error);
      }
    };
    data();
  }, [latitude, longitude]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 4000);
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  // allRestaurant.length < 0 && console.log("Loading");
  return (
    <div className="flex flex-col flex-auto w-full items-center pt-24 p-2 space-x-3 ease-in ">
      <div className="p-5 flex space-x-3">
        <Input
          placeholder="Enter the restaurant you want...."
          className="w-[500px]"
          onChange={(e) => {
            const data = allRestaurant.filter((restaurant) => {
              return restaurant?.info.name
                .toLowerCase()
                .includes(e.target.value.toLowerCase());
            });
            console.log(data);
            setFilterdRestaurant(data);
          }}
        />
      </div>
      <div className="flex flex-wrap w-full items-center justify-center ">
        <Suspense fallback={<Loading />}>
          {filterdRestaurant ? (
            filterdRestaurant.map((restaurants: any) => {
              return (
                <Link to={`/restaurant/${restaurants?.info.id}`}>
                  <RestaurantCard
                    key={restaurants?.info.id}
                    restaurants={restaurants?.info}
                  />
                </Link>
              );
            })
          ) : (
            <p>No Restaurants Found :(</p>
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default Dashboard;
