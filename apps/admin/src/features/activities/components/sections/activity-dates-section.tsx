"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  getActivityDates,
  updateActivityDates,
} from "@repo/actions/activities.actions";
import { Loader2 } from "lucide-react";

export function ActivityDatesSection({ activityId }: { activityId: number }) {
  const [dates, setDates] = useState<Date[] | undefined>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const fetchedDates = await getActivityDates(activityId);
        setDates(fetchedDates);
      } catch (error) {
        console.error("Failed to fetch dates", error);
        toast.error("Failed to load available dates");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchDates();
  }, [activityId]);

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateActivityDates(activityId, dates || []);
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
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center border rounded-md p-4">
        <Calendar
          mode="multiple"
          selected={dates}
          onSelect={setDates}
          className="rounded-md border"
          disabled={(date) => date <= new Date(new Date().setHours(0, 0, 0, 0))}
        />
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Dates
        </Button>
      </div>
    </div>
  );
}
