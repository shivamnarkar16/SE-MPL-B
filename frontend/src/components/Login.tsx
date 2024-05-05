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
import { useUserContext } from "@/context/User";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";
import Loading from "./Loading";

const formSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(8),
});

const Login = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { login } = useUserContext();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try{
      setLoading(true)
    setError("");
    login(values);
    }
    catch(e:any){
      setError("please Provide Correct Credentials")
    }

    
    // window.location.href = "/";
  };
  // const { toast } = useToast();
 useEffect(()=>{
  error
  ? toast.error("Please enter correct credentials", {
      description: `${error}`,
      action: {
        label: "Close",
        onClick: () => console.log("Close"),
      },
      duration: 2000,
    })
  : "";
 },[error])

    if (loading) {
      return <Loading text="Logging In "/>
    }
    
     return (
   <>
      <div className="h-[92vh] flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold text-center mb-4 p-10">Login</h1>
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
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isLoading ? (
              <Button>
                <Loader2 className="dark:text-slate-900 animate-spin " />
              </Button>
            ) : (
              <Button type="submit">Login</Button>
            )}
          </form>
        </Form>

        <Toaster closeButton />
      </div>
    </>
  );
};

export default Login;
