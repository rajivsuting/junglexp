"use client";

import { Loader2, Mail, Shield, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUser, updateUser } from "@repo/actions/users.actions";
import { userRoles } from "@repo/db/schema/user";

export const getUserRoles = () => {
  return [
    { value: "user", label: "User" },
    { value: "admin", label: "Admin" },
    { value: "super_admin", label: "Super Admin" },
  ] as const;
};

import type { TUser } from "@repo/db";
const userFormSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(225),
  lastName: z.string().min(1, "Last name is required").max(225),
  email: z.string().email("Invalid email address").max(255),
  user_role: z.enum(userRoles.enumValues, {
    required_error: "Role is required",
  }),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  user?: TUser;
  mode: "create" | "edit";
}

const UserForm = ({ user, mode }: UserFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles = getUserRoles();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: user?.first_name || "",
      lastName: user?.last_name || "",
      email: user?.email || "",
      user_role: user?.user_role || "user",
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    setIsSubmitting(true);

    try {
      let result;

      if (mode === "create") {
        result = await createUser({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.user_role,
        });
      } else if (user) {
        result = await updateUser(user.user_id, {
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.user_role,
        });
      }

      if (result?.success) {
        toast.success(
          mode === "create"
            ? "User created successfully. An invitation has been sent to their email."
            : "User updated successfully"
        );
        router.push("/users");
        router.refresh();
      } else {
        toast.error(result?.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageTitle = mode === "create" ? "Create User" : "Edit User";
  const submitText = mode === "create" ? "Create User" : "Update User";

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold flex items-center gap-2">
          <User className="h-6 w-6" />
          {pageTitle}
        </CardTitle>
        {mode === "create" && (
          <p className="text-sm text-muted-foreground">
            Create a new user account. An invitation email will be sent to the
            user.
          </p>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <User className="h-4 w-4" />
                Personal Information
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Account Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Mail className="h-4 w-4" />
                Account Information
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email address"
                        {...field}
                        disabled={mode === "edit"}
                      />
                    </FormControl>
                    {mode === "edit" && (
                      <FormDescription>
                        Email cannot be changed after user creation.
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Permissions */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Shield className="h-4 w-4" />
                Permissions
              </div>
              <FormField
                control={form.control}
                name="user_role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem
                            key={role.value}
                            value={role.value.toString()}
                          >
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {field.value === "user" &&
                        "Regular user with basic permissions"}
                      {field.value === "admin" &&
                        "Admin user with elevated permissions"}
                      {field.value === "super_admin" &&
                        "Super admin with full system access"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {submitText}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserForm;
