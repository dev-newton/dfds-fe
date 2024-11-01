import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addDays,
  addHours,
  setMinutes,
  startOfHour,
  format,
  set,
  startOfDay,
  isBefore,
} from "date-fns";

import type { VesselsType } from "~/pages/api/vessel/getAll";
import type { VesselsType as UnitTypes } from "~/pages/api/unitType/getAll";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { DateTimePicker } from "./DateTimePicker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { MultiSelect } from "./MultiSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const today = startOfDay(new Date());
const nextDay = addDays(today, 1);

const nextHour = addHours(setMinutes(new Date(), 0), 1);

const voyageSchema = z
  .object({
    portOfLoading: z
      .string({
        required_error: "Port of loading is required",
      })
      .min(3, "Minimum length is 3 chars"),
    portOfDischarge: z
      .string({
        required_error: "Port of discharge is required",
      })
      .min(3, "Minimum length is 3 chars"),
    vessel: z
      .string({
        required_error: "Vessel name is required",
      })
      .min(3, "Minimum length is 3 chars"),
    unitTypes: z
      .array(z.string(), {
        required_error: "Unit types is required",
      })
      .min(5, "Please select at least 5 unit types"),
    departure: z
      .date({
        required_error: "Departure date and time is required",
      })
      .refine(
        (date) => {
          const startOfNextHour = addHours(startOfHour(new Date()), 1);

          const twentyFourHoursFromStartOfNextHour = addHours(
            startOfNextHour,
            24,
          );
          return date >= twentyFourHoursFromStartOfNextHour;
        },
        {
          message:
            "Departure time must be set at least 24 hours from the next full hour.",
        },
      ),
    arrival: z.date({
      required_error: "Arrival date and time is required",
    }),
  })
  .superRefine(({ departure, arrival }, ctx) => {
    if (departure && arrival) {
      const twoHoursAfterDeparture = addHours(departure, 2);
      if (arrival <= departure) {
        ctx.addIssue({
          code: "custom",
          path: ["arrival"],
          message: "Arrival time must be after the departure time.",
        });
      } else if (arrival < twoHoursAfterDeparture) {
        ctx.addIssue({
          code: "custom",
          path: ["arrival"],
          message: "Arrival must be at least two hours after departure.",
        });
      }
    }
  });

export type VoyageFormData = z.infer<typeof voyageSchema>;

interface IVoyageForm {
  vessels?: VesselsType;
  unitTypes?: UnitTypes;
  onCreate: (data: VoyageFormData) => void;
}

export function VoyageForm({ vessels, unitTypes, onCreate }: IVoyageForm) {
  const form = useForm<VoyageFormData>({
    resolver: zodResolver(voyageSchema),
  });

  const onSubmit = (data: VoyageFormData) => {
    onCreate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void form.handleSubmit(onSubmit)(e);
        }}
        className="mt-5 space-y-4"
      >
        <FormField
          control={form.control}
          name="portOfLoading"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Port of Loading</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="capitalize"
                  placeholder="Port of Loading"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="portOfDischarge"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Port of Discharge</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="capitalize"
                  placeholder="Port of Discharge"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vessel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vessel</FormLabel>
              <FormControl>
                <Select
                  {...field}
                  value={field.value}
                  onValueChange={(val) => field.onChange(val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vessel" />
                  </SelectTrigger>
                  <SelectContent>
                    {vessels?.map((vessel) => {
                      return (
                        <SelectItem key={vessel.value} value={vessel.value}>
                          {vessel.label}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unitTypes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit Types</FormLabel>
              <FormControl>
                <MultiSelect
                  options={unitTypes ?? []}
                  selectedOptions={field.value ?? []}
                  onChange={(selected) => field.onChange(selected)}
                  placeholder="unit types"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="departure"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Departure</FormLabel>
              <FormControl>
                <DateTimePicker
                  date={field.value}
                  time={format(field.value ?? nextHour, "HH:mm")}
                  disabledDate={(date) => isBefore(date, nextDay)}
                  onDateChange={(newDate) => {
                    field.onChange(newDate);
                    form.clearErrors("arrival");
                  }}
                  onTimeChange={(newTime) => {
                    const [hours, minutes] = newTime.split(":").map(Number);
                    const baseDate = field.value || nextDay;
                    const updatedDate = set(baseDate, { hours, minutes });
                    field.onChange(updatedDate);
                    form.clearErrors("arrival");
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="arrival"
          render={({ field }) => (
            <FormItem
              onClick={() => {
                const departure = form.getValues("departure");
                if (!departure) {
                  form.setError("arrival", {
                    type: "manual",
                    message:
                      "Please select a departure date before choosing an arrival date",
                  });
                }
              }}
            >
              <FormLabel>Arrival</FormLabel>
              <FormControl>
                <DateTimePicker
                  date={field.value}
                  time={format(field.value ?? nextHour, "HH:mm")}
                  disabled={!form.getValues("departure")}
                  disabledDate={(date) => isBefore(date, nextDay)}
                  onDateChange={(newDate) => field.onChange(newDate)}
                  onTimeChange={(newTime) => {
                    const [hours, minutes] = newTime.split(":").map(Number);
                    const baseDate = field.value || nextDay;
                    const updatedDate = set(baseDate, { hours, minutes });
                    field.onChange(updatedDate);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" variant="default" className="mt-4">
          Submit
        </Button>
      </form>
    </Form>
  );
}
