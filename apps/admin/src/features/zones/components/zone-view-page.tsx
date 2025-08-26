import { getZoneById } from "@repo/actions/zones.actions";

import ZoneForm from "./zone-form";

import type { TZone } from "@repo/db/index";

type TZoneViewPageProps = {
  zoneId: string;
};

const ZoneViewPage = async ({ zoneId }: TZoneViewPageProps) => {
  let Zone: TZone | null = null;
  let pageTitle = "Create New National Park";

  if (zoneId !== "new") {
    Zone = await getZoneById(Number(zoneId));

    pageTitle = "Update National Park";

    if (!Zone) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Zone Not Found</h2>
            <p className="text-gray-600">
              The zone you're looking for doesn't exist.
            </p>
          </div>
        </div>
      );
    }
  }

  return <ZoneForm initialData={Zone} pageTitle="Edit Zone" />;
};

export default ZoneViewPage;
