export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading guide...</p>
        </div>
    );
}
