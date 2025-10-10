"use client";

import { Check, Clock, Eye, MoreHorizontal, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { updateActivityBookingStatus } from '@repo/actions/activity-bookings.actions';

import type { ActivityBookingWithRelations } from "./columns";

interface CellActionProps {
  data: ActivityBookingWithRelations;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<
    "pending" | "confirmed" | "cancelled" | null
  >(null);
  const router = useRouter();

  const handleStatusUpdate = async (
    status: "pending" | "confirmed" | "cancelled"
  ) => {
    setSelectedStatus(status);
    setShowStatusDialog(true);
  };

  const confirmStatusUpdate = async () => {
    if (!selectedStatus) return;

    setLoading(true);
    try {
      await updateActivityBookingStatus(data.id, selectedStatus);
      toast.success(`Booking status updated to ${selectedStatus}`);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update booking status");
      console.error(error);
    } finally {
      setLoading(false);
      setShowStatusDialog(false);
      setSelectedStatus(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-600";
      case "cancelled":
        return "text-red-600";
      case "pending":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(data.id.toString())}
          >
            Copy booking ID
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/activity-bookings/${data.id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Update Status</DropdownMenuLabel>
          {data.status !== "pending" && (
            <DropdownMenuItem
              onClick={() => handleStatusUpdate("pending")}
              className={getStatusColor("pending")}
            >
              <Clock className="mr-2 h-4 w-4" />
              Mark as Pending
            </DropdownMenuItem>
          )}
          {data.status !== "confirmed" && (
            <DropdownMenuItem
              onClick={() => handleStatusUpdate("confirmed")}
              className={getStatusColor("confirmed")}
            >
              <Check className="mr-2 h-4 w-4" />
              Mark as Confirmed
            </DropdownMenuItem>
          )}
          {data.status !== "cancelled" && (
            <DropdownMenuItem
              onClick={() => handleStatusUpdate("cancelled")}
              className={getStatusColor("cancelled")}
            >
              <X className="mr-2 h-4 w-4" />
              Mark as Cancelled
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Booking Status</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change the booking status for{" "}
              <strong>{data.name}</strong> to{" "}
              <span
                className={`font-semibold ${getStatusColor(selectedStatus || "")}`}
              >
                {selectedStatus}
              </span>
              ?
              {selectedStatus === "cancelled" && (
                <div className="mt-2 text-red-600">
                  This action will cancel the booking and may trigger
                  notification emails.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmStatusUpdate}
              disabled={loading}
              className={
                selectedStatus === "cancelled"
                  ? "bg-red-600 hover:bg-red-700"
                  : selectedStatus === "confirmed"
                    ? "bg-green-600 hover:bg-green-700"
                    : ""
              }
            >
              {loading ? "Updating..." : `Update to ${selectedStatus}`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
