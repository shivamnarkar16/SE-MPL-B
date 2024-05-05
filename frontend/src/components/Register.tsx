import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

import { request } from "@/lib/Request";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, Command, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState } from "react";

const formSchema = z
  .object({
    username: z.string().min(2).max(50),
    password: z.string().min(8),
    email: z.string().email(),
    confirmPassword: z.string().min(8),
    city: z.string({
      required_error: "Please select a city.",
    }),
    address: z.string().min(2).max(150),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
  });

const Register = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      city: "",
      address: "",
    },
  });

  const [open, setOpen] = useState(false);
  const [city, setCity] = useState("Mumbai");

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
      value: "Kanjurmarg",
      label: "Kanjurmarg",
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
  function compare(a, b) {
    if (a.last_nom < b.last_nom) {
      return -1;
    }
    if (a.last_nom > b.last_nom) {
      return 1;
    }
    return 0;
  }
  const isLoading = form.formState.isSubmitting;
  const navigate = useNavigate();
  console.log(cities);
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // console.log(values.email, values.username, values.password);
    const formValues = {
      email: values.email,
      username: values.username,
      password: values.password,
      address: values.address,
      city: values.city,
    };
    request({
      url: "/register",
      method: "POST",
      data: formValues,
    })
      .then((res) => {
        console.log(res.data);
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div className="h-[100vh]  flex flex-col justify-center items-center pt-64 ">
        <h1 className="text-4xl font-bold text-center mb-4 p-10">Register</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shimav" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <div className="space-y-3 md:items-center ">
              <p>Location selected : </p>
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormControl>
                    <Select
                      {...field}
                      onOpenChange={(isOpen) => setOpen(isOpen)}
                      onValueChange={(value) => {
                        form.setValue("city", value);
                        setCity(value);
                      }}
                      // className="py-2 px-4 mx-2 w-full dark:bg-slate-900 dark:text-white"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={city} />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem
                            value={city.value}
                            className="dark:bg-slate-900 dark:text-white"
                          >
                            {city.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                )}
              />
            </div>
            {isLoading ? <Loader2 /> : <Button type="submit" >Submit</Button>}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Register;
