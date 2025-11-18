"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { sendSuggestionAction } from "@/services/internal/user-attention-service/suggestions.actions";

export default function HelpPage() {
    const dict = useDictionary();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formSchema = dict
        ? z.object({
              suggestion: z.string().min(1, dict.help.validation.required),
          })
        : z.object({
              suggestion: z.string().min(1, ""),
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
            await sendSuggestionAction(values.suggestion);
            if (dict) {
                toast.success(dict.help.successToast);
            }
            form.reset();
        } catch {
            toast.error("Error sending suggestion");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!dict) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <h1 className="text-center">{dict.help.title}</h1>
            <div className="text-center space-y-4">
                <h2>{dict.help.suggestionsTitle}</h2>
                <p>{dict.help.description}</p>
            </div>
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
                                <FormLabel>{dict.help.label}</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder={dict.help.placeholder}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : dict.help.submitButton}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
