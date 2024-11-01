"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InvalidateQueryFilters } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { VoyageForm } from "~/components/VoyageForm";
import type { VoyageFormData, VesselsType, UnitTypes } from "~/types";
import { useToast } from "~/hooks/use-toast";

interface SheetFormProps {
  vessels: VesselsType;
  unitTypes: UnitTypes;
}

export function SheetForm({ vessels, unitTypes }: SheetFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const voyageMutation = useMutation({
    mutationFn: async (body: VoyageFormData) => {
      const preparedBody = {
        ...body,
        departure: body.departure.toISOString(),
        arrival: body.arrival.toISOString(),
      };

      const response = await fetch(`/api/voyage/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preparedBody),
      });

      if (!response.ok) {
        throw new Error("Failed to create voyage");
      }
    },
    onSuccess: async () => {
      setIsOpen(false);

      toast({
        variant: "default",
        title: "Voyage added successfully!",
        description: "A new voyage has been added to your list.",
        duration: 3000,
      });

      await queryClient.invalidateQueries([
        "voyages",
      ] as InvalidateQueryFilters);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to create voyage. Please try again.",
      });
    },
  });

  const handleCreate = (data: VoyageFormData) => {
    voyageMutation.mutate(data);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          onClick={() => setIsOpen(true)}
          variant="default"
          className="my-3 px-10"
        >
          Create
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Create New Voyage</SheetTitle>
          <SheetDescription>
            Fill in the details for the new voyage.
          </SheetDescription>
        </SheetHeader>
        <VoyageForm
          vessels={vessels}
          unitTypes={unitTypes}
          onCreate={handleCreate}
        />
      </SheetContent>
    </Sheet>
  );
}
