"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lightbulb } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useDictionary } from "@/hooks/use-dictionary";
import { SuggestionController } from "@/services/internal/user-attention-service/suggestion.controller";
import { useSuggestionDialogStore } from "@/stores/suggestion-dialog-store";

export default function FloatingSuggestionButton() {
    const dict = useDictionary();
    const { isOpen, setOpen, closeDialog } = useSuggestionDialogStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formSchema = dict
        ? z.object({
              suggestion: z
                  .string()
                  .min(
                      1,
                      dict.help.validation?.required ||
                          "This field is required",
                  ),
          })
        : z.object({
              suggestion: z.string().min(1, "This field is required"),
          });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            suggestion: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            await SuggestionController.sendSuggestion(values.suggestion);
            if (dict) {
                toast.success(
                    dict.help.successToast || "Suggestion sent successfully!",
                );
            } else {
                toast.success("Suggestion sent successfully!");
            }
            form.reset();
            closeDialog();
        } catch {
            toast.error("Error sending suggestion");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!dict) {
        return null; // Or a loading state, but since it's floating, maybe render anyway
    }

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="fixed bottom-4 right-4 z-50" size="icon">
                    <Lightbulb />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {dict.help.suggestionsTitle || "Suggestions"}
                    </DialogTitle>
                    <DialogDescription>
                        {dict.help.description ||
                            "Share your feedback or suggestions for the app."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="suggestion"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {dict.help.label || "Your suggestion"}
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={
                                                dict.help.placeholder ||
                                                "Write your suggestion here..."
                                            }
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting
                                ? "Sending..."
                                : dict.help.submitButton || "Send"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
