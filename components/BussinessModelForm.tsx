import api from "../src/lib/api";
import { FC } from "react";
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
import { useRouter } from "next/router";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useMutation } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(3),
  state: z.string().min(3),
  country: z.string().min(3),
  pincode: z.string().length(5),
});

const LocationForm: FC = () => {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      state: "",
      country: "",
      pincode: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      api.post("/api/location", {
        name: values.name,
        state: values.state,
        country: values.country,
        pincode: values.pincode,
      });
      router.push("/dashboard");
      toast({
        description: "Location added successfully!",
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="San Francisco" {...field} />
              </FormControl>
              <FormDescription>Name of the city</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input placeholder="California" {...field} />
              </FormControl>
              <FormDescription>Name of the state/province</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input placeholder="United States of America" {...field} />
              </FormControl>
              <FormDescription>Name of the country</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pincode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zipcode</FormLabel>
              <FormControl>
                <Input placeholder="94102" {...field} />
              </FormControl>
              <FormDescription>
                Most Relevant Pincode for the location
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" variant={"default"}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default LocationForm;
