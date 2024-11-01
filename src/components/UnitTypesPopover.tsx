import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Separator } from "~/components/ui/separator"


interface IUnitTypesPopover {
  trigger: string | number;
  types: {
    name: string;
    defaultLength: number;
  }[];
}

export function UnitTypesPopover({ trigger, types }: IUnitTypesPopover) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="link">{trigger}</Button>
      </PopoverTrigger>
      <PopoverContent className="h-72 overflow-y-auto">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Unit Types</h4>
            <p className="text-sm text-muted-foreground">
              Unit types and their default lengths.
            </p>
          </div>
          <div className="grid h-full  gap-2">
            {types.map((type) => (
              <div key={type.name}>
                <div className="flex items-center justify-between py-2">
                  <Label className="text-xs text-gray-400">{type.name}</Label>
                  <Label>{type.defaultLength}</Label>
                </div>
                <Separator  />
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
