import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { InvalidateQueryFilters } from "@tanstack/react-query";
import { format } from "date-fns";
import Head from "next/head";

import { useToast } from "~/hooks/use-toast";
import Layout from "~/components/layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { fetchData } from "~/utils";

import type { ReturnType, VesselsType, UnitTypes } from "~/types";
import { Button } from "~/components/ui/button";
import { TABLE_DATE_FORMAT } from "~/constants";
import { UnitTypesPopover } from "~/components/UnitTypesPopover";
import { SheetForm } from "~/components/SheetForm";

export default function Home() {
  const { toast } = useToast();

  const { data: voyages } = useQuery<ReturnType>({
    queryKey: ["voyages"],
    queryFn: () => fetchData("voyage/getAll"),
  });

  const { data: vessels } = useQuery<VesselsType>({
    queryKey: ["vessels"],
    queryFn: () => fetchData("vessel/getAll"),
  });

  const { data: unitTypes } = useQuery<UnitTypes>({
    queryKey: ["unitTypes"],
    queryFn: () => fetchData("unitType/getAll"),
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (voyageId: string) => {
      const response = await fetch(`/api/voyage/delete?id=${voyageId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the voyage");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries([
        "voyages",
      ] as InvalidateQueryFilters);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: error.name,
        description: error.message,
        duration: 5000,
      });
    },
  });

  const handleDelete = (voyageId: string) => {
    mutation.mutate(voyageId);
  };

  return (
    <>
      <Head>
        <title>Voyages | DFDS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <SheetForm vessels={vessels!} unitTypes={unitTypes!} />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Departure</TableHead>
              <TableHead>Arrival</TableHead>
              <TableHead>Port of loading</TableHead>
              <TableHead>Port of discharge</TableHead>
              <TableHead>Vessel</TableHead>
              <TableHead>Unit Types</TableHead>
              <TableHead>&nbsp;</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {voyages
              ?.sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              )
              .map((voyage) => (
                <TableRow key={voyage.id}>
                  <TableCell>
                    {format(
                      new Date(voyage.scheduledDeparture),
                      TABLE_DATE_FORMAT,
                    )}
                  </TableCell>
                  <TableCell>
                    {format(
                      new Date(voyage.scheduledArrival),
                      TABLE_DATE_FORMAT,
                    )}
                  </TableCell>
                  <TableCell>{voyage.portOfLoading}</TableCell>
                  <TableCell>{voyage.portOfDischarge}</TableCell>
                  <TableCell>{voyage.vessel.name}</TableCell>
                  <TableCell>
                    <UnitTypesPopover
                      trigger={voyage.unitTypes.length}
                      types={voyage.unitTypes}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        handleDelete(voyage.id);
                      }}
                      variant="outline"
                    >
                      X
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Layout>
    </>
  );
}
