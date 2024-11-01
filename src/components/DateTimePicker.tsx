"use client";

import * as React from "react";
import { format, set } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";

import { cn } from "src/utils";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface IDatePicker {
  date: Date | null;
  time: string;
  disabled?: boolean;
  onDateChange: (newDate: Date) => void;
  onTimeChange: (newTime: string) => void;
  disabledDate?: (newDate: Date) => boolean;
}

export function DateTimePicker({
  date,
  time,
  disabled,
  onDateChange,
  onTimeChange,
  disabledDate,
}: IDatePicker) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => !disabled && setIsOpen(open)}
    >
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            `${format(date, "dd/MM/yyyy")}, ${time}`
          ) : (
            <span>Pick a date and time</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="mx-6 flex w-auto flex-col gap-4 overflow-hidden"
        align="start"
      >
        <div className="flex w-auto gap-4">
          <Calendar
            mode="single"
            selected={date!}
            disabled={disabledDate}
            onSelect={(selectedDate) => {
              if (!selectedDate) return;
              const [hours, minutes] = time?.split(":").map(Number);
              const dateWithTime = set(selectedDate, { hours, minutes });
              onDateChange(dateWithTime);
            }}
          />
          <Select open={true} defaultValue={time} onValueChange={onTimeChange}>
            <SelectTrigger className="mt-2 !w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="pointer-events-none h-[240px] border-none bg-transparent shadow-none">
              {[...Array(24)].map((_, i) => {
                const hour = String(i).padStart(2, "0");
                return (
                  <SelectItem
                    key={i}
                    value={`${hour}:00`}
                    className="w-[100px]"
                  >
                    {hour}:00
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => setIsOpen(false)}
          className="ml-auto w-fit select-none"
          disabled={!date || !time}
        >
          Done
        </Button>
      </PopoverContent>
    </Popover>
  );
}
