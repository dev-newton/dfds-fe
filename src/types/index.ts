import type { ReturnType } from "~/pages/api/voyage/getAll";
import type { VesselsType } from "~/pages/api/vessel/getAll";
import type { VesselsType as UnitTypes } from "~/pages/api/unitType/getAll";

type VoyageFormData = {
  portOfLoading: string;
  portOfDischarge: string;
  vessel: string;
  unitTypes: string[];
  departure: Date;
  arrival: Date;
};

export type { ReturnType, VesselsType, UnitTypes, VoyageFormData };
