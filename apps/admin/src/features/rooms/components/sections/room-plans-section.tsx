"use client";

import { Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createRoomPlan,
  deleteRoomPlan,
  updateRoomPlan,
} from "@repo/actions/rooms.actions";
import { MEAL_PLAN_DESCRIPTIONS } from "@repo/db/schema/rooms";

import type { TRoom } from "@repo/db/schema/types";

// Room Plan schema
const roomPlanSchema = z.object({
  plan_type: z.enum(["EP", "CP", "MAP", "AP"]),
  price: z.number().min(0, "Price must be non-negative"),
  description: z.string().optional(),
  is_active: z.number().min(0).max(1).default(1),
});

type RoomPlanFormData = z.infer<typeof roomPlanSchema>;

interface RoomPlansSectionProps {
  initialData?: TRoom | null;
  roomId?: string;
  onSave?: (data: any) => Promise<void>;
}

export default function RoomPlansSection({
  initialData,
  roomId,
  onSave,
}: RoomPlansSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);

  const form = useForm<RoomPlanFormData>({
    resolver: zodResolver(roomPlanSchema),
    defaultValues: {
      plan_type: "EP",
      price: 0,
      description: "",
      is_active: 1,
    },
  });

  const mealPlanOptions = [
    { value: "EP", label: "European Plan (Room only)" },
    { value: "CP", label: "Continental Plan (Room + Breakfast)" },
    {
      value: "MAP",
      label: "Modified American Plan (Room + Breakfast + Dinner)",
    },
    { value: "AP", label: "American Plan (All meals included)" },
  ] as const;

  const openModal = (plan?: any) => {
    if (plan) {
      setEditingPlan(plan);
      form.reset({
        plan_type: plan.plan_type,
        price: Number(plan.price),
        description: plan.description || "",
        is_active: plan.is_active,
      });
    } else {
      setEditingPlan(null);
      form.reset({
        plan_type: "EP",
        price: 0,
        description: "",
        is_active: 1,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
    form.reset();
  };

  const handleCreatePlan = async (data: RoomPlanFormData) => {
    if (!roomId) return;

    try {
      setIsLoading(true);
      await createRoomPlan({
        room_id: Number(roomId),
        ...data,
      });
      toast.success("Room plan created successfully");
      closeModal();
      // Refresh the page or update the data
      window.location.reload();
    } catch (error) {
      console.error("Failed to create room plan:", error);
      toast.error("Failed to create room plan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePlan = async (planId: number, data: RoomPlanFormData) => {
    try {
      setIsLoading(true);
      await updateRoomPlan(planId, data);
      toast.success("Room plan updated successfully");
      closeModal();
      // Refresh the page or update the data
      window.location.reload();
    } catch (error) {
      console.error("Failed to update room plan:", error);
      toast.error("Failed to update room plan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePlan = async (planId: number) => {
    if (!confirm("Are you sure you want to delete this room plan?")) return;

    try {
      setIsLoading(true);
      await deleteRoomPlan(planId);
      toast.success("Room plan deleted successfully");
      // Refresh the page or update the data
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete room plan:", error);
      toast.error("Failed to delete room plan");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: RoomPlanFormData) => {
    if (editingPlan) {
      await handleUpdatePlan(editingPlan.id, data);
    } else {
      await handleCreatePlan(data);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Room Plans</h3>
        <p className="text-sm text-muted-foreground">
          Manage different meal plans and pricing for this room
        </p>
      </div>

      {/* Add Room Plan Button */}
      <div className="flex justify-start">
        <Button onClick={() => openModal()} className="px-6">
          <Plus className="mr-2 h-4 w-4" />
          Add Room Plan
        </Button>
      </div>

      {/* Room Plan Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? "Edit Room Plan" : "Add New Room Plan"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="plan_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meal Plan Type *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select meal plan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mealPlanOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter price"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          disabled={isLoading}
                          min={0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter plan description (optional)"
                        className="min-h-[80px]"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value.toString()}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Active</SelectItem>
                        <SelectItem value="0">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? "Saving..."
                    : editingPlan
                      ? "Update Plan"
                      : "Create Plan"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Existing Room Plans */}
      {initialData?.plans && initialData.plans.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Current Room Plans</h4>
          <div className="space-y-3">
            {initialData.plans.map((plan) => (
              <div
                key={plan.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className="font-medium">
                      {
                        mealPlanOptions.find(
                          (opt) => opt.value === plan.plan_type
                        )?.label
                      }
                    </div>
                    <div className="text-lg font-semibold">${plan.price}</div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs ${
                        plan.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {plan.is_active ? "Active" : "Inactive"}
                    </div>
                  </div>
                  {plan.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {plan.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openModal(plan)}
                    disabled={isLoading}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeletePlan(plan.id)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
