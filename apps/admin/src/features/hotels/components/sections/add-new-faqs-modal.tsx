"use client";

import { Loader2, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFaqs } from '@repo/actions/faqs.actions';

import type { TFaqsBase } from "@repo/db/schema/faqs";

const newFaqsFormSchema = z.object({
  faqs: z
    .array(
      z.object({
        question: z.string().min(1, "Question is required"),
        answer: z.string().min(1, "Answer is required"),
      })
    )
    .min(1, "At least one FAQ is required"),
});

type NewFaqsFormData = z.infer<typeof newFaqsFormSchema>;

interface AddNewFaqsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFaqsCreated: (faqs: TFaqsBase[]) => void;
  title: string;
  description: string;
}

export const AddNewFaqsModal = ({
  isOpen,
  onClose,
  onFaqsCreated,
  title,
  description,
}: AddNewFaqsModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NewFaqsFormData>({
    resolver: zodResolver(newFaqsFormSchema),
    defaultValues: {
      faqs: [{ question: "", answer: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "faqs",
  });

  const handleSubmit = async (data: NewFaqsFormData) => {
    try {
      setIsSubmitting(true);

      // Create all FAQs in parallel
      const createdFaqs = await createFaqs(
        data.faqs.map((faq) => ({
          question: faq.question.trim(),
          answer: faq.answer.trim(),
        }))
      );

      if (createdFaqs.length > 0) {
        onFaqsCreated(createdFaqs);
        toast.success(`${createdFaqs.length} FAQs created successfully`);

        // Reset form and close modal
        form.reset({ faqs: [{ question: "", answer: "" }] });
        onClose();
      } else {
        toast.error("No valid FAQs to create");
      }
    } catch (error) {
      console.error("Error creating FAQs:", error);
      toast.error("Failed to create FAQs. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset({ faqs: [{ question: "", answer: "" }] });
    onClose();
  };

  const addNewFaqField = () => {
    append({ question: "", answer: "" });
  };

  const removeFaqField = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                FAQs ({fields.length})
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addNewFaqField}
                disabled={isSubmitting}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another FAQ
              </Button>
            </div>

            <ScrollArea className="h-[500px] border rounded-md p-4">
              <div className="space-y-6">
                {fields.map((field, index) => (
                  <div key={field.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        FAQ {index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFaqField(index)}
                        disabled={isSubmitting || fields.length === 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <FormField
                        control={form.control}
                        name={`faqs.${index}.question`}
                        render={({ field: inputField }) => (
                          <FormItem>
                            <FormLabel>Question</FormLabel>
                            <FormControl>
                              <Input
                                {...inputField}
                                placeholder="Enter FAQ question"
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`faqs.${index}.answer`}
                        render={({ field: inputField }) => (
                          <FormItem>
                            <FormLabel>Answer</FormLabel>
                            <FormControl>
                              <Textarea
                                {...inputField}
                                placeholder="Enter FAQ answer"
                                className="min-h-[80px]"
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {index < fields.length - 1 && (
                      <hr className="border-border" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="text-xs text-muted-foreground">
              Tip: Press "Add Another FAQ" to create multiple FAQs at once. Each
              FAQ should have a clear question and detailed answer.
            </div>
          </form>
        </Form>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(handleSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Creating..." : `Create ${fields.length} FAQs`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
