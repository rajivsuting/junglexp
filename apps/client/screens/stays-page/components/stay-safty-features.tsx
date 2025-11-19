import { DynamicIcon } from 'lucide-react/dynamic';

import type { THotel } from "@repo/db/index";
import type { FC } from "react";
import type { IconName } from "lucide-react/dynamic";

type StaySaftyFeaturesProps = Pick<THotel, "saftyFeatures"> & {};

export const StaySaftyFeatures: FC<StaySaftyFeaturesProps> = (props) => {
  const { saftyFeatures } = props;

  return (
    <section className="py-6 border-b border-border">
      <h2 className="text-xl font-semibold text-primary">Safety features</h2>

      <div
        className={
          "grid grid-cols-1 md:grid-cols-2 gap-3 transition-all opacity-100 pt-4"
        }
      >
        {saftyFeatures.map(({ feature }) => (
          <div
            key={feature.id}
            className="flex items-center gap-3 text-primary py-2"
          >
            <div className="text-muted-foreground">
              <DynamicIcon name={feature.icon as IconName} size={14} />
            </div>
            {feature.label}
          </div>
        ))}
      </div>
    </section>
  );
};
