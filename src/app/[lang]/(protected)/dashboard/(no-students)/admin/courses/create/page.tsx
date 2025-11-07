"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CoverDropzone } from "@/components/learning/cover-dropzone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDebounce } from "@/hooks/use-debounce";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import { UserRole } from "@/lib/consts";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import type { UserSearchResult } from "@/services/internal/iam/controller/auth.response";
import { CourseController } from "@/services/internal/learning/courses/controller/course.controller";
import { CourseDifficulty } from "@/services/internal/learning/courses/domain/course.entity";
import { TopicController } from "@/services/internal/learning/topics/topic.controller";
import type {
  CreateTopicRequest,
  TopicResponse,
} from "@/services/internal/learning/topics/topic.response";
import { ProfileController } from "@/services/internal/profiles/profiles/controller/profile.controller";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum([
    CourseDifficulty.BEGINNER,
    CourseDifficulty.INTERMEDIATE,
    CourseDifficulty.ADVANCED,
    CourseDifficulty.EXPERT,
  ]),
  coverImage: z.string().min(1, "Cover image is required"),
  authorIds: z.array(z.string()).min(1, "At least one author is required"),
  topicIds: z.array(z.string()).min(1, "At least one topic is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateCoursePage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const PATHS = useLocalizedPaths();

  // Topic management
  const [topicSearchQuery, setTopicSearchQuery] = useState("");
  const [topicSearchResults, setTopicSearchResults] = useState<TopicResponse[]>(
    [],
  );
  const [searchingTopics, setSearchingTopics] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<TopicResponse[]>([]);
  const [showTopicResults, setShowTopicResults] = useState(false);
  const [showCreateTopicDialog, setShowCreateTopicDialog] = useState(false);
  const [creatingTopic, setCreatingTopic] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const topicSearchRef = useRef<HTMLDivElement>(null);

  // Author management
  const [authorSearchQuery, setAuthorSearchQuery] = useState("");
  const [authorSearchResults, setAuthorSearchResults] = useState<
    UserSearchResult[]
  >([]);
  const [searchingAuthors, setSearchingAuthors] = useState(false);
  const [selectedAuthors, setSelectedAuthors] = useState<UserSearchResult[]>(
    [],
  );
  const [showAuthorResults, setShowAuthorResults] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const authorSearchRef = useRef<HTMLDivElement>(null);

  const debouncedTopicSearch = useDebounce(topicSearchQuery, 300);
  const debouncedAuthorSearch = useDebounce(authorSearchQuery, 300);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: CourseDifficulty.BEGINNER,
      coverImage: "",
      authorIds: [],
      topicIds: [],
    },
  });

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const roles = await AuthController.getUserRoles();
        const role = roles.find(
          (r) => r === UserRole.TEACHER || r === UserRole.ADMIN,
        );
        setUserRole(role || null);

        if (role) {
          // Get current user and add as default author
          const userId = await AuthController.getUserId();
          const userEmail = await AuthController.getUserEmail();
          const userProfile = await ProfileController.getCurrentUserProfile();
          setCurrentUserId(userId);
          setSelectedAuthors([
            {
              id: userId,
              email: userEmail,
              username: userProfile?.username || "",
              profilePicture: userProfile?.profileUrl || "",
            },
          ]);
          form.setValue("authorIds", [userId]);
        }
      } catch (error) {
        console.error("Error checking permissions:", error);
      } finally {
        setLoading(false);
      }
    };

    checkPermissions();
  }, [form]);

  // Search topics with debounce
  useEffect(() => {
    const searchTopics = async () => {
      if (!debouncedTopicSearch.trim()) {
        setTopicSearchResults([]);
        setShowTopicResults(false);
        return;
      }

      setSearchingTopics(true);
      try {
        const results = await TopicController.searchTopicsByName({
          name: debouncedTopicSearch,
        });
        const filtered = results.filter(
          (topic) => !selectedTopics.some((t) => t.id === topic.id),
        );
        setTopicSearchResults(filtered);
        setShowTopicResults(true);
      } catch (error) {
        console.error("Error searching topics:", error);
      } finally {
        setSearchingTopics(false);
      }
    };

    searchTopics();
  }, [debouncedTopicSearch, selectedTopics]);

  // Search authors with debounce
  useEffect(() => {
    const searchAuthors = async () => {
      if (!debouncedAuthorSearch.trim()) {
        setAuthorSearchResults([]);
        setShowAuthorResults(false);
        return;
      }

      setSearchingAuthors(true);
      try {
        const results = await AuthController.searchUsers({
          username: debouncedAuthorSearch,
        });
        const filtered = results.filter(
          (user) => !selectedAuthors.some((a) => a.id === user.id),
        );
        setAuthorSearchResults(filtered);
        setShowAuthorResults(true);
      } catch (error) {
        console.error("Error searching authors:", error);
      } finally {
        setSearchingAuthors(false);
      }
    };

    searchAuthors();
  }, [debouncedAuthorSearch, selectedAuthors]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        topicSearchRef.current &&
        !topicSearchRef.current.contains(event.target as Node)
      ) {
        setShowTopicResults(false);
      }
      if (
        authorSearchRef.current &&
        !authorSearchRef.current.contains(event.target as Node)
      ) {
        setShowAuthorResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddTopic = (topic: TopicResponse) => {
    const newTopics = [...selectedTopics, topic];
    setSelectedTopics(newTopics);
    form.setValue(
      "topicIds",
      newTopics.map((t) => t.id),
    );
    setTopicSearchQuery("");
    setShowTopicResults(false);
  };

  const handleRemoveTopic = (topicId: string) => {
    const newTopics = selectedTopics.filter((t) => t.id !== topicId);
    setSelectedTopics(newTopics);
    form.setValue(
      "topicIds",
      newTopics.map((t) => t.id),
    );
  };

  const handleCreateTopic = async () => {
    if (!newTopicName.trim()) return;

    setCreatingTopic(true);
    try {
      const request: CreateTopicRequest = { name: newTopicName.trim() };
      const newTopic = await TopicController.createTopic(request);
      handleAddTopic(newTopic);
      setNewTopicName("");
      setShowCreateTopicDialog(false);
    } catch (error) {
      console.error("Error creating topic:", error);
    } finally {
      setCreatingTopic(false);
    }
  };

  const handleAddAuthor = (author: UserSearchResult) => {
    const newAuthors = [...selectedAuthors, author];
    setSelectedAuthors(newAuthors);
    form.setValue(
      "authorIds",
      newAuthors.map((a) => a.id),
    );
    setAuthorSearchQuery("");
    setShowAuthorResults(false);
  };

  const handleRemoveAuthor = (authorId: string) => {
    // Prevent removing current user if they're the only author
    if (selectedAuthors.length === 1 && authorId === currentUserId) {
      return;
    }
    const newAuthors = selectedAuthors.filter((a) => a.id !== authorId);
    setSelectedAuthors(newAuthors);
    form.setValue(
      "authorIds",
      newAuthors.map((a) => a.id),
    );
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      const course = await CourseController.createCourse({
        title: data.title,
        description: data.description,
        coverImage: data.coverImage,
        difficultyLevel: data.difficulty,
        authorIds: data.authorIds,
        topicIds: data.topicIds,
      });

      router.push(PATHS.DASHBOARD.COURSES.VIEW(course.id));
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Failed to create course. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="space-y-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!userRole) {
    return (
      <div className="container mx-auto p-4">
        <div className="space-y-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="text-center space-y-4">
            <h1 className="text-2xl font-semibold">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have permission to create courses.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b">
        <div>
          <h1 className="text-2xl font-semibold">Create Course</h1>
          <p className="text-muted-foreground">
            Create a new course for your students.
          </p>
        </div>
      </header>

      <div className="h-full overflow-y-auto p-6">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 max-w-2xl mx-auto"
        >
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title *
            </Label>
            <Input
              id="title"
              {...form.register("title")}
              placeholder="Enter course title"
              className="w-full"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description *
            </Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Enter course description"
              className="w-full min-h-[120px]"
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="difficulty" className="text-sm font-medium">
              Difficulty *
            </Label>
            <Select
              value={form.watch("difficulty")}
              onValueChange={(value) =>
                form.setValue("difficulty", value as CourseDifficulty)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CourseDifficulty.BEGINNER}>
                  Beginner
                </SelectItem>
                <SelectItem value={CourseDifficulty.INTERMEDIATE}>
                  Intermediate
                </SelectItem>
                <SelectItem value={CourseDifficulty.ADVANCED}>
                  Advanced
                </SelectItem>
                <SelectItem value={CourseDifficulty.EXPERT}>Expert</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.difficulty && (
              <p className="text-sm text-red-500">
                {form.formState.errors.difficulty.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Cover Image *</Label>
            <CoverDropzone
              onImageUrlChange={(url) => form.setValue("coverImage", url)}
              currentImage={form.watch("coverImage")}
              disabled={saving}
              aspectRatio="wide"
            />
            {form.formState.errors.coverImage && (
              <p className="text-sm text-red-500">
                {form.formState.errors.coverImage.message}
              </p>
            )}
          </div>

          {/* Topics Section */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Topics *</Label>
            <div className="space-y-2">
              {selectedTopics.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedTopics.map((topic) => (
                    <Badge key={topic.id} variant="secondary">
                      {topic.name}
                      <button
                        type="button"
                        onClick={() => handleRemoveTopic(topic.id)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="relative" ref={topicSearchRef}>
                <Input
                  value={topicSearchQuery}
                  onChange={(e) => setTopicSearchQuery(e.target.value)}
                  onFocus={() => setShowTopicResults(true)}
                  placeholder="Search topics..."
                  className="w-full"
                />
                {showTopicResults && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {searchingTopics ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        Searching...
                      </div>
                    ) : topicSearchResults.length > 0 ? (
                      topicSearchResults.map((topic) => (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => handleAddTopic(topic)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                        >
                          {topic.name}
                        </button>
                      ))
                    ) : topicSearchQuery.trim() ? (
                      <div className="p-2">
                        <button
                          type="button"
                          onClick={() => {
                            setNewTopicName(topicSearchQuery);
                            setShowCreateTopicDialog(true);
                            setShowTopicResults(false);
                          }}
                          className="w-full text-left px-2 py-2 hover:bg-gray-100 text-sm text-blue-600"
                        >
                          Create "{topicSearchQuery}"
                        </button>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
            {form.formState.errors.topicIds && (
              <p className="text-sm text-red-500">
                {form.formState.errors.topicIds.message}
              </p>
            )}
          </div>

          {/* Authors Section */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Authors *</Label>
            <div className="space-y-2">
              {selectedAuthors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedAuthors.map((author) => (
                    <Badge key={author.id} variant="secondary">
                      {author.username}
                      {author.id !== currentUserId ||
                      selectedAuthors.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => handleRemoveAuthor(author.id)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      ) : null}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="relative" ref={authorSearchRef}>
                <Input
                  value={authorSearchQuery}
                  onChange={(e) => setAuthorSearchQuery(e.target.value)}
                  onFocus={() => setShowAuthorResults(true)}
                  placeholder="Search authors..."
                  className="w-full"
                />
                {showAuthorResults && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {searchingAuthors ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        Searching...
                      </div>
                    ) : authorSearchResults.length > 0 ? (
                      authorSearchResults.map((author) => (
                        <button
                          key={author.id}
                          type="button"
                          onClick={() => handleAddAuthor(author)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                        >
                          @{author.username} ({author.email})
                        </button>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-muted-foreground">
                        No authors found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            {form.formState.errors.authorIds && (
              <p className="text-sm text-red-500">
                {form.formState.errors.authorIds.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                router.push(PATHS.DASHBOARD.ADMINISTRATION.COURSES.ROOT)
              }
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Creating..." : "Create Course"}
            </Button>
          </div>
        </form>
      </div>

      {/* Create Topic Dialog */}
      {showCreateTopicDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Create New Topic</h3>
            <Input
              value={newTopicName}
              onChange={(e) => setNewTopicName(e.target.value)}
              placeholder="Topic name"
              className="mb-4"
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCreateTopicDialog(false);
                  setNewTopicName("");
                }}
                disabled={creatingTopic}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCreateTopic}
                disabled={creatingTopic || !newTopicName.trim()}
              >
                {creatingTopic ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
