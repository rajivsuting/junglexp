import { Check, X } from 'lucide-react';

interface Policy {
  policy?: {
    name: string;
    description?: string | null;
    kind: "include" | "exclude";
  } | null;
}

interface ActivityPoliciesSectionProps {
  policies: Policy[];
  kind: "include" | "exclude";
}

export function ActivityPoliciesSection({
  policies,
  kind,
}: ActivityPoliciesSectionProps) {
  if (!policies || policies.length === 0) {
    return null;
  }

  const isIncluded = kind === "include";
  const Icon = isIncluded ? Check : X;
  const title = isIncluded ? "What's Included" : "What's Not Included";
  const iconColor = isIncluded ? "text-green-600" : "text-red-600";
  const bgColor = isIncluded ? "bg-green-50" : "bg-red-50";
  const borderColor = isIncluded ? "border-green-200" : "border-red-200";

  return (
    <section className="py-6 border-b border-border">
      <h2 className="text-xl font-bold text-primary mb-4">{title}</h2>

      <div className={`${bgColor} ${borderColor} border rounded-lg p-4`}>
        <ul className="space-y-3">
          {policies.map((policyItem, index) => {
            const policy = policyItem.policy;
            if (!policy) return null;

            return (
              <li key={index} className="flex items-start gap-3">
                <Icon className={`w-4 h-4 ${iconColor} mt-0.5 flex-shrink-0`} />
                <div className="flex-1">
                  <span className="text-primary font-medium">
                    {policy.name}
                  </span>
                  {policy.description && (
                    <p className="text-muted-foreground text-sm mt-1">
                      {policy.description}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
