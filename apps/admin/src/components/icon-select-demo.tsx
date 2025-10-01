"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';

import { IconSelect, IconSelectButton, IconSelectFormField } from './icon-select';

// Example form schema
const formSchema = z.object({
  icon: z.string().optional(),
  menuIcon: z.string().min(1, "Please select a menu icon"),
});

type FormValues = z.infer<typeof formSchema>;

export function IconSelectDemo() {
  const [selectedIcon, setSelectedIcon] = React.useState<string>("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      icon: "",
      menuIcon: "",
    },
  });

  const onSubmit = (values: FormValues) => {};

  return (
    <div className="space-y-8 p-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Icon Select Demo</h1>
        <p className="text-muted-foreground">
          Examples of how to use the icon picker component in different ways.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic usage with custom trigger */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Trigger</CardTitle>
            <CardDescription>
              Use IconSelect with your own custom trigger component
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <IconSelect
              onIconSelect={setSelectedIcon}
              selectedIcon={selectedIcon as any}
              searchPlaceholder="Search for an icon..."
            >
              <Button variant="outline" className="w-full">
                {selectedIcon ? (
                  <>
                    <span className="mr-2">🎯</span>
                    {selectedIcon}
                  </>
                ) : (
                  "Click to select an icon"
                )}
              </Button>
            </IconSelect>
            {selectedIcon && (
              <p className="text-sm text-muted-foreground">
                Selected: <code>{selectedIcon}</code>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Pre-built button component */}
        <Card>
          <CardHeader>
            <CardTitle>Pre-built Button</CardTitle>
            <CardDescription>
              Use the IconSelectButton for a ready-to-use solution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <IconSelectButton
              onIconSelect={setSelectedIcon}
              selectedIcon={selectedIcon as any}
              variant="outline"
              className="w-full"
            />
            {selectedIcon && (
              <p className="text-sm text-muted-foreground">
                Selected: <code>{selectedIcon}</code>
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Form integration example */}
      <Card>
        <CardHeader>
          <CardTitle>Form Integration</CardTitle>
          <CardDescription>
            Use IconSelectFormField with react-hook-form and zod validation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <IconSelectFormField
                control={form.control}
                name="icon"
                label="Optional Icon"
                description="Choose an icon for your project (optional)"
                placeholder="No icon selected"
              />

              <IconSelectFormField
                control={form.control}
                name="menuIcon"
                label="Menu Icon (Required)"
                description="This field is required and will show validation errors"
                variant="outline"
                size="default"
              />

              <div className="flex gap-4">
                <Button type="submit">Submit Form</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Reset
                </Button>
              </div>

              {/* Show form values */}
              <div className="mt-4 p-4 bg-muted rounded-md">
                <h4 className="font-medium mb-2">Current Form Values:</h4>
                <pre className="text-sm">
                  {JSON.stringify(form.watch(), null, 2)}
                </pre>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
