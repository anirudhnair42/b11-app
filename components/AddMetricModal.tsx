import React, { FC, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import api from "@/src/lib/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "./ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  value: z.coerce
    .number()
    .refine((x) => x * 100 - Math.trunc(x * 100) < Number.EPSILON),
  stringValue: z.string().optional(),
});

const enum MetricType {
  NUMBER = "NUMBER",
  STRING = "STRING",
  DATETIME = "DATETIME",
}

export type MetricDto = {
  id: string;
  name: string;
  type: MetricType;
  description: string | null;
  annualized: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const AddMetricModal: FC<{
  companyId: string;
}> = ({ companyId }) => {
  const [capturedAt, setCapturedAt] = useState<Date>();
  const [dateValue, setDateValue] = useState<Date | undefined>();
  const [open, setOpen] = useState(false);

  const {
    data: metrics,
    isLoading,
    isError,
  } = useQuery(["metrics"], () =>
    api.get("/api/metrics").then((res) => res.data)
  );
  const [metricId, setMetricId] = useState("");
  const [currentMetric, setCurrentMetric] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: 0,
      stringValue: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const request = api.post("/api/metricsnapshots", {
        ...values,
        metricId: metricId,
        companyId: companyId,
        capturedAt: capturedAt,
      });
      console.log(request);
      toast({
        description: "Metric Snapshot added successfully!",
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Metric Snapshot</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a metric snapshot</DialogTitle>
          <DialogDescription>
            Select the metric you want to add and enter the date it was captured
            along with the value.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FormItem className="flex flex-col space-y-4">
                <FormLabel>Metric</FormLabel>
                <FormControl>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[200px] justify-between"
                      >
                        {currentMetric
                          ? metrics.find(
                              (metric: MetricDto) => metric.id === metricId
                            )?.name
                          : "Select metric..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search industry..." />
                        <CommandEmpty>No Metric found.</CommandEmpty>
                        <CommandGroup>
                          {metrics.map((metric: MetricDto) => (
                            <CommandItem
                              key={metric.id}
                              onSelect={(currentValue: string) => {
                                setCurrentMetric(
                                  currentValue === metric.id ? "" : currentValue
                                );
                                setMetricId(metric.id);
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  currentMetric === metric.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {metric.name}
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
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input placeholder="42" {...field} />
                  </FormControl>
                  <FormDescription>
                    Value of the metric to record
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stringValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metric Period (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Annual" {...field} />
                  </FormControl>
                  <FormDescription>
                    Useful for metrics like Fiscal Year
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Date Value (Optional)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !dateValue && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateValue ? (
                      format(dateValue, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateValue}
                    onSelect={setDateValue}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Store date values for metrics like Raise Date
              </FormDescription>
              <FormMessage />
            </FormItem>
            <FormItem>
              <FormLabel>Date Captured On</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !capturedAt && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {capturedAt ? (
                      format(capturedAt, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={capturedAt}
                    onSelect={setCapturedAt}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Date when the metric was captured
              </FormDescription>
              <FormMessage />
            </FormItem>

            <Button type="submit">Save changes</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMetricModal;
