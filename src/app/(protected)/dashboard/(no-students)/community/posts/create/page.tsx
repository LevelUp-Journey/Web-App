import CreatePostForm from "@/components/community/create-post-form";

export default function CreatePostPage() {
    return (
        <div className="container mx-auto p-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-semibold mb-6">Create New Post</h1>
                <CreatePostForm />
            </div>
        </div>
    );
}
