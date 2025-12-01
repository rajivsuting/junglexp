"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  getActivityDates,
  updateActivityDates,
  getActivityById,
  updateActivity,
} from "@repo/actions/activities.actions";
import { Loader2 } from "lucide-react";

export function ActivityDatesSection({ activityId }: { activityId: number }) {
  const [dates, setDates] = useState<Date[] | undefined>([]);
  const [dateType, setDateType] = useState<"predefined" | "any">("predefined");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedDates, activity] = await Promise.all([
          getActivityDates(activityId),
          getActivityById(activityId),
        ]);
        setDates(fetchedDates);
        if (activity?.date_type) {
          setDateType(activity.date_type as "predefined" | "any");
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast.error("Failed to load activity data");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchData();
  }, [activityId]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateActivity(activityId, { date_type: dateType });

      if (dateType === "predefined") {
        await updateActivityDates(activityId, dates || []);
      }

      toast.success("Dates updated successfully");
    } catch (error) {
      console.error("Failed to save dates", error);
      toast.error("Failed to save dates");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Date Selection Type</Label>
        <RadioGroup
          value={dateType}
          onValueChange={(value) => setDateType(value as "predefined" | "any")}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="predefined" id="predefined" />
            <Label htmlFor="predefined">Predefined Dates</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="any" id="any" />
            <Label htmlFor="any">Any Date</Label>
          </div>
        </RadioGroup>
      </div>

      {dateType === "predefined" && (
        <div className="flex flex-col items-center justify-center border rounded-md p-4">
          <Calendar
            mode="multiple"
            selected={dates}
            onSelect={setDates}
            className="rounded-md border"
            disabled={(date) =>
              date <= new Date(new Date().setHours(0, 0, 0, 0))
            }
          />
        </div>
      )}

      {dateType === "any" && (
        <div className="p-4 border rounded-md bg-muted/50 text-sm text-muted-foreground text-center">
          Customers will be able to select any future date for this activity.
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Configuration
        </Button>
      </div>
    </div>
  );
}
