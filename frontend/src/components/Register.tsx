import { useForm } from "react-hook-form";
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

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { request } from "@/lib/Request";

const formSchema = z
  .object({
    username: z.string().min(2).max(50),
    password: z.string().min(8),
    email: z.string().email(),
    confirmPassword: z.string().min(8),
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
    },
  });

  const isLoading = form.formState.isSubmitting;
  const navigate = useNavigate();
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // console.log(values.email, values.username, values.password);
    const formValues = {
      email: values.email,
      username: values.username,
      password: values.password,
    };
    request({
      url: "/register",
      method: "POST",
      data: formValues,
      
    });
    navigate("/dashboard");
  };

  return (
    <div>
      <div className="h-[92vh] flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold text-center mb-4 p-10">Register</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                  <FormDescription>
                    We will sent you a verification code on this email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isLoading ? <Loader2 /> : <Button type="submit">Submit</Button>}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Register;
