import api from "../src/lib/api";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/router";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const SigninModal: FC = () => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await api.post("/api/login", {
        email: values.email,
        password: values.password,
      });
      const { token } = response.data;

      // Store the JWT token in cookies or local storage
      localStorage.setItem("token", token);

      // Optionally, redirect the user to a dashboard or login page after successful registration
      router.push("/dashboard");
      toast({
        description: "Login successful!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  return (
    <Card className="w-full max-w-sm p-4 m-auto bg-white rounded-md shadow-md dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-4xl">
          Welcome to the{" "}
          <span className="text-blue-400">Companies Interface</span>
        </CardTitle>
        <CardDescription className="pt-2">
          Log in to use the Base10 knowledge base
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe@base10.com" {...field} />
                  </FormControl>
                  <FormDescription>Your Email Address</FormDescription>
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
                    <Input placeholder="********" type="password" {...field} />
                  </FormControl>
                  <FormDescription>Your Password</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" variant={"default"}>
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SigninModal;
