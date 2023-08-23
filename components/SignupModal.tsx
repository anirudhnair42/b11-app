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
import { useRouter } from "next/router";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string(),
  lastName: z.string(),
  permissions: z.enum(["ADMIN", "READ", "WRITE"]),
});

const SignupModal: FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await api.post("/api/register", {
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        permissions: values.permissions,
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
      console.error("Signup error:", error);
    }
  };

  return (
    <Card className="w-full max-w-sm p-4 m-auto bg-white rounded-md shadow-md dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-4xl">
          Register for the{" "}
          <span className="text-blue-400">Companies Interface</span>
        </CardTitle>
        <CardDescription className="pt-2">
          Register to use the Base10 knowledge base
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
            <div className="flex justify-between gap-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormDescription>Your First Name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormDescription>Your Last Name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
            <FormField
              control={form.control}
              name="permissions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permissions</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select access permissions" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ADMIN">ADMIN</SelectItem>
                      <SelectItem value="READ">READ</SelectItem>
                      <SelectItem value="WRITE">WRITE</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Admins can create users</FormDescription>
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

export default SignupModal;
