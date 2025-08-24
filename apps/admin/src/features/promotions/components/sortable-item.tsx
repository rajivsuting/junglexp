import { GripVertical, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import type { TPromotionBase } from "@repo/db/schema/promotions";

interface SortableItemProps {
  id: number;
  promotion: TPromotionBase;
  onRemove: (id: number) => void;
}

export function SortableItem({ id, promotion, onRemove }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="transition-all duration-200 py-4 hover:shadow-md"
    >
      <CardContent className="flex items-center gap-3 px-4">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing hover:text-primary transition-colors"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="font-medium leading-none">{promotion.name}</h3>
          <p className="text-sm text-muted-foreground">{promotion.link}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground font-mono">
            #{promotion.order}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(promotion.id)}
            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
