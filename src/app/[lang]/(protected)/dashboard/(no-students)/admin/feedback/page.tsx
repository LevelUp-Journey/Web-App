import { getDictionary } from "@/app/[lang]/dictionaries";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { SuggestionController } from "@/services/internal/user-attention-service/suggestion.controller";

export const dynamic = "force-dynamic";

type Suggestion = {
    comment: string;
    createdAt: string;
    id: string;
    isResolved: boolean;
};

export default async function FeedbackPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang as "en" | "es");

    const suggestions: Suggestion[] =
        await SuggestionController.getAllSuggestions();

    console.log(suggestions);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">{dict.feedback.title}</h1>
                <p className="text-muted-foreground">
                    {dict.feedback.description}
                </p>
            </div>

            {suggestions.length === 0 ? (
                <p className="text-center text-muted-foreground">
                    {dict.feedback.noSuggestions}
                </p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{dict.feedback.table.date}</TableHead>
                            <TableHead>
                                {dict.feedback.table.suggestion}
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {suggestions.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    {new Date(
                                        item.createdAt,
                                    ).toLocaleDateString(
                                        lang === "es" ? "es-ES" : "en-US",
                                    )}
                                </TableCell>
                                <TableCell>{item.comment}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
