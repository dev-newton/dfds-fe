import * as React from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "~/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";

interface Option {
  id: string;
  name: string;
}

interface IMultiSelect {
  options: Option[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({
  options,
  selectedOptions = [],
  onChange,
  placeholder = "",
}: IMultiSelect) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSelect = (value: string) => {
    const updatedOptions = selectedOptions.includes(value)
      ? selectedOptions.filter((id) => id !== value)
      : [...selectedOptions, value];

    onChange(updatedOptions);
  };

  const displayText =
    selectedOptions.length > 0
      ? options
          .filter((opt) => selectedOptions.includes(opt.id))
          .map((opt) => opt.name)
          .join(", ")
      : `Select ${placeholder}`;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full">
          <div className="flex h-[1.25rem] w-full items-start overflow-x-auto whitespace-nowrap">
            {displayText}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-2">
        <Command>
          <CommandInput placeholder={`Search ${placeholder}...`} />
          <CommandList className="h-48">
            <CommandEmpty>No results found.</CommandEmpty>
            {options.map((option) => (
              <CommandItem
                key={option.id}
                onSelect={() => handleSelect(option.id)}
                className="z-[19] flex cursor-pointer items-center space-x-2"
              >
                <Checkbox
                  checked={selectedOptions.includes(option.id)}
                  onCheckedChange={() => handleSelect(option.id)}
                  className="mr-2"
                />
                <span>{option.name}</span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>

        <Button
          variant="secondary"
          onClick={() => setIsOpen(false)}
          className="mt-4 w-full"
        >
          Done
        </Button>
      </PopoverContent>
    </Popover>
  );
}
