import PostFeed from "@/components/community/post-feed";
import { PostController } from "@/services/internal/community/controller/post.controller";

export default async function CommunityPage() {
    // For now, we'll show all posts. Later we can add user-specific feed
    const posts = await PostController.getAllPosts();

    return (
        <div className="w-full h-full overflow-y-auto">
            <PostFeed posts={posts} title="Community Feed" />
        </div>
    );
}
