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
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { useQuery } from "@tanstack/react-query";
import { IndustryDto } from "@/lib/dto";

const formSchema = z.object({
  name: z.string().min(3),
  website: z.string().url(),
  description: z.string().min(10).optional(),
  logo: z.string().url().optional(),
});

const CompanyForm: FC = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);

  const {
    data: industries,
    isLoading,
    isError,
  } = useQuery(["industries"], () =>
    api.get("/api/industries").then((res) => res.data)
  );
  const [industryId, setIndustryId] = useState("");
  const [currentIndustry, setCurrentIndustry] = useState<string | null>(null);

  const {
    data: locations,
    isLoading: isLocationLoading,
    isError: isLocationError,
  } = useQuery(["locations"], () =>
    api.get("/api/locations").then((res) => res.data)
  );
  const [locationId, setLocationId] = useState("");
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      website: "",
      description: "",
      logo: "",
    },
  });

  if (isError) {
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong. Please reload",
      description: "There was an error fetching the industries.",
      action: <ToastAction altText="Try again">Try again</ToastAction>,
    });
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      api.post("/api/companies", {
        name: values.name,
        industryId: industryId,
        website: values.website,
        description: values.description,
        logo: values.logo,
        locationId: locationId,
      });
      window.location.reload();
      toast({
        description: "Company added successfully!",
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
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Stripe" {...field} />
              </FormControl>
              <FormDescription>Name of the Company</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Payments Infra" {...field} />
              </FormControl>
              <FormDescription>Short Description of Company</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="www.stripe.com" {...field} />
              </FormControl>
              <FormDescription>Company&apos;s website</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo URL</FormLabel>
              <FormControl>
                <Input placeholder="www.stripe.com/logo/png" {...field} />
              </FormControl>
              <FormDescription>
                (Optional) Logo URL of the company
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FormItem className="flex flex-col space-y-4">
            <FormLabel>Industry</FormLabel>
            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                  >
                    {currentIndustry
                      ? industries.find(
                          (industry: IndustryDto) => industry.id === industryId
                        )?.name
                      : "Select industry..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search industry..." />
                    <CommandEmpty>No Industry found.</CommandEmpty>
                    <CommandGroup>
                      {industries.map((industry: IndustryDto) => (
                        <CommandItem
                          key={industry.id}
                          onSelect={(currentValue: string) => {
                            setCurrentIndustry(
                              currentValue === industry.id ? "" : currentValue
                            );
                            setIndustryId(industry.id);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              currentIndustry === industry.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {industry.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormDescription>Industry of the company</FormDescription>
            <FormMessage />
          </FormItem>
        )}

        {isLocationLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FormItem className="flex flex-col space-y-4">
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Popover open={locationOpen} onOpenChange={setLocationOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={locationOpen}
                    className="w-[200px] justify-between"
                  >
                    {currentLocation
                      ? locations.find(
                          (location: IndustryDto) => location.id === locationId
                        )?.name
                      : "Select location..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search location..." />
                    <CommandEmpty>No Location found.</CommandEmpty>
                    <CommandGroup>
                      {locations.map((location: IndustryDto) => (
                        <CommandItem
                          key={location.id}
                          onSelect={(currentValue: string) => {
                            setCurrentLocation(
                              currentValue === location.id ? "" : currentValue
                            );
                            setLocationId(location.id);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              currentLocation === location.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {location.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormDescription>Industry of the company</FormDescription>
            <FormMessage />
          </FormItem>
        )}

        <Button type="submit" className="w-full" variant={"default"}>
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default CompanyForm;
