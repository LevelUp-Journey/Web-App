import PostFeed from "@/components/community/post-feed";
import { PostController } from "@/services/internal/community/controller/post.controller";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import { UserRole } from "@/lib/consts";

export default async function CommunityPage() {
    // For now, we'll show all posts. Later we can add user-specific feed
    const posts = await PostController.getAllPosts();

    // Get user roles to check if user can create posts
    const userRoles = await AuthController.getUserRoles();
    const canCreatePost = userRoles.includes(UserRole.TEACHER) || userRoles.includes(UserRole.ADMIN);

    return (
        <div className="w-full h-full overflow-y-auto">
            <PostFeed posts={posts} title="Community Feed" canCreatePost={canCreatePost} />
        </div>
    );
}
