import type { Challenge } from "@/services/internal/challenges/entities/challenge.entity";

export default function ChallengeSummary({
    challenge,
}: {
    challenge: Challenge;
}) {
    return (
        <section className="space-y-4">
            <h2 className="text-xl font-semibold">Challenge Summary</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <strong>Title:</strong> {challenge.name}
                </div>
                <div>
                    <strong>Status:</strong> {challenge.status}
                </div>
                <div>
                    <strong>Experience Points:</strong>{" "}
                    {challenge.experiencePoints}
                </div>
                <div>
                    <strong>Tags:</strong>{" "}
                    {challenge.tags.map((tag) => tag.name).join(", ")}
                </div>
            </div>
        </section>
    <form onSubmit={onSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold">Edit Details</h2>

        <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                        Challenge Title
                    </FieldLabel>
                    <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter challenge title"
                        autoComplete="off"
                    />
                    {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                    )}
                </Field>
            )}
        />

        <Controller
            name="tags"
            control={form.control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                        Tags (comma separated)
                    </FieldLabel>
                    <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="e.g., JavaScript, React, Node.js"
                        autoComplete="off"
                    />
                    {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                    )}
                </Field>
            )}
        />

        <Controller
            name="difficulty"
            control={form.control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                        Difficulty Level
                    </FieldLabel>
                    <Select
                        name={field.name}
                        value={field.value}
                        onValueChange={field.onChange}
                    >
                        <SelectTrigger
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                        >
                            <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ChallengeDifficulty.EASY}>
                                Easy
                            </SelectItem>
                            <SelectItem value={ChallengeDifficulty.MEDIUM}>
                                Medium
                            </SelectItem>
                            <SelectItem value={ChallengeDifficulty.HARD}>
                                Hard
                            </SelectItem>
                            <SelectItem value={ChallengeDifficulty.EXPERT}>
                                Expert
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                    )}
                </Field>
            )}
        />

        <Controller
            name="experiencePoints"
            control={form.control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                        Experience Points
                    </FieldLabel>
                    <Input
                        {...field}
                        id={field.name}
                        type="number"
                        aria-invalid={fieldState.invalid}
                        min="0"
                        placeholder="100"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                    {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                    )}
                </Field>
            )}
        />

        <div className="flex gap-4">
            <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
                Delete Challenge
            </Button>
        </div>
    </form>;
    {/* Code Versions Shortcuts */}
    <div className="space-y-4">
        <h2 className="text-xl font-semibold">
            Code Versions
        </h2>
        <div className="space-y-2">
            {codeVersions.map((version) => (
                <div
                    key={version.id}
                    className="flex justify-between items-center p-2 border rounded"
                >
                    <div>
                        <strong>
                            {version.language}
                        </strong>{" "}
                        -{" "}
                        {version.initialCode.substring(
                            0,
                            50,
                        )}
                        ...
                    </div>
                    <Button size="sm" variant="outline">
                        Edit
                    </Button>
                </div>
            ))}
            {codeVersions.length === 0 && (
                <p className="text-muted-foreground text-sm">
                    No code versions yet. Click "Add
                    Code Version" to create one.
                </p>
            )}
        </div>
    </div>
    )
}
