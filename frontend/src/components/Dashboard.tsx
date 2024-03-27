import { Suspense, useEffect, useState } from "react";
import RestaurantCard from "./RestaurantCard";
import { Check, ChevronsUpDown } from "lucide-react";
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

const cities = [
  {
    value: "mumbai",
    label: "Mumbai",
  },
  {
    value: "Mazgaon",
    label: "Mazgaon",
  },
  {
    value: "Churchgate",
    label: "Churchgate",
  },
  {
    value: "Malad West",
    label: "Malad West",
  },
  {
    value: "pune",
    label: "Pune",
  },
  {
    value: "delhi",
    label: "Delhi",
  },
  {
    value: "bangalore",
    label: "Bangalore",
  },
  {
    value: "hyderabad",
    label: "Hyderabad",
  },
  {
    value: "chennai",
    label: "Chennai",
  },
  {
    value: "kolkata",
    label: "Kolkata",
  },
  {
    value: "ahmedabad",
    label: "Ahmedabad",
  },
  {
    value: "jaipur",
    label: "Jaipur",
  },
  {
    value: "lucknow",
    label: "Lucknow",
  },
  {
    value: "kanpur",
    label: "Kanpur",
  },
  {
    value: "nagpur",
    label: "Nagpur",
  },
  {
    value: "indore",
    label: "Indore",
  },
  {
    value: "patna",
    label: "Patna",
  },
  {
    value: "bhopal",
    label: "Bhopal",
  },
  {
    value: "vadodara",
    label: "Vadodara",
  },
  {
    value: "nashik",
    label: "Nashik",
  },

  {
    value: "rajkot",
    label: "Rajkot",
  },
  {
    value: "meerut",
    label: "Meerut",
  },
  {
    value: "vasai-virar",
    label: "Vasai-Virar",
  },
  {
    value: "varanasi",
    label: "Varanasi",
  },
  {
    value: "srinagar",
    label: "Srinagar",
  },
  {
    value: "dhanbad",
    label: "Dhanbad",
  },
  {
    value: "jodhpur",
    label: "Jodhpur",
  },
  {
    value: "amritsar",
    label: "Amritsar",
  },
  {
    value: "allahabad",
    label: "Allahabad",
  },
  {
    value: "ranchi",
    label: "Ranchi",
  },
  {
    value: "coimbatore",
    label: "Coimbatore",
  },

  {
    value: "Kalyan",
    label: "Kalyan",
  },
];
import Loading from "./Loading";
import { BASE_API_URL, setURL } from "@/lib/Constants";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
// import Navbar from "./Navbar";

const Dashboard = () => {
  const [allRestaurant, setAllRestaurant] = useState([]);

  const [open, setOpen] = useState(false);
  const [city, setCity] = useState("Mumbai");
  const [latitude, setLatitude] = useState(19.08157715);
  const [longitude, setLongitude] = useState(72.88662753964906);
  async function checkJsonData(jsonData: any) {
    for (let i = 0; i < jsonData?.data?.cards.length; i++) {
      // initialize checkData for Swiggy Restaurant data
      const checkData =
        jsonData?.data?.cards[i]?.card?.card?.gridElements?.infoWithStyle
          ?.restaurants;

      // if checkData is not undefined then return it
      if (checkData !== undefined) {
        return checkData;
      }
    }
  }

  const FormSchema = z.object({
    city: z.string({
      required_error: "Please select a city.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    setCity(data.city);
    setIsLoading(true);
    getCoordinates(data.city);
  }

  const getCoordinates = async (city: string) => {
    try {
      if (city !== "") {
        console.log(city);
        const data = await fetch(`https://geocode.maps.co/search?q=${city}`);

        const json = await data.json();
        const lat = json[0].lat;
        const lon = json[0].lon;
        console.log(latitude, longitude);
        setLatitude(lat);
        setLongitude(lon);
      } else {
        console.log(city);
        const data = await fetch(`https://geocode.maps.co/search?q=${city}`);

        const json = await data.json();
        const lat = json[0].lat;
        const lon = json[0].lon;
        console.log(latitude, longitude);
        setLatitude(lat);
        setLongitude(lon);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const getRestaurants = async (latitude1: any, longitude1: any) => {
  //   try {
  //     //, 72.9243186303278

  //     const json = await data.json();

  //     // was showing an error of data fatching because sometime data coming from cards[1] sometime cards[2] and different on other times so me make a function and check which value of i gives data in cards[i]

  //     // call the checkJsonData() function which return Swiggy Restaurant data
  //     const resData = await checkJsonData(json);
  //     const cityData = await checkCity(json);

  //     // update the state variable restaurants with Swiggy API data
  //     console.log(resData);
  //     setAllRestaurant(resData);
  //     console.log(cityData);
  //     console.log(city);
  //     // setCity(cityData);
  //     // setFilterdRestaurant(resData);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
        console.log(resData);
        setAllRestaurant(resData);
        setIsLoading(false);
        // console.log(cityData);
      } catch (error) {
        console.log(error);
      }
    };
    data();
  }, [latitude, longitude]);
  const [isLoading, setIsLoading] = useState(true);

  const loading = form.formState.isSubmitting;
  useEffect(() => {
    // Simulate an API call
    if (loading === true) {
      setIsLoading(false);
    }
  }, [loading]);

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
    <div className="flex flex-col flex-auto w-full items-center pt-24 p-2 space-x-3">
      <p className="p-4 ml-4 md:flex md:items-center ">
        Location selected :{" "}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-3 space-x-6 flex md:flex-row flex-col items-center w-full  space-y-3 "
          >
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="flex ">
                  {/* <FormLabel>Language</FormLabel> */}
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? cities.find((city) => city.value === field.value)
                                ?.label
                            : city}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search city..." />
                        <CommandEmpty>No City found.</CommandEmpty>
                        <CommandGroup>
                          {cities.map((city) => (
                            <CommandItem
                              value={city.label}
                              key={city.value}
                              onSelect={() => {
                                form.setValue("city", city.value);
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  city.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {city.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </p>
      <div className="flex flex-wrap w-full items-center justify-center ">
        <Suspense fallback={<Loading />}>
          {allRestaurant ? (
            allRestaurant.map((restaurants: any) => {
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
