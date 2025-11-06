"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  GripVertical,
  Loader2,
  Plus,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CoverDropzone } from "@/components/learning/cover-dropzone";
import { DifficultyBadge } from "@/components/learning/difficulty-badge";
import { TopicBadge } from "@/components/learning/topic-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useDebounce } from "@/hooks/use-debounce";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";
import type { UserSearchResult } from "@/services/internal/iam/controller/auth.response";
import { CourseController } from "@/services/internal/learning/courses/controller/course.controller";
import type { UpdateCourseRequest } from "@/services/internal/learning/courses/controller/course.response";
import {
  type Course,
  CourseDifficulty,
} from "@/services/internal/learning/courses/domain/course.entity";
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";
import type { GuideResponse } from "@/services/internal/learning/guides/controller/guide.response";
import { TopicController } from "@/services/internal/learning/topics/topic.controller";
import type { TopicResponse } from "@/services/internal/learning/topics/topic.response";

// Temporary interface for guide display in course
interface CourseGuideDisplay {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  likesCount: number;
  pagesCount: number;
  createdAt: string;
  position: number;
}

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  coverImage: z.string().min(1, "Cover image is required"),
  difficultyLevel: z.nativeEnum(CourseDifficulty),
  topicIds: z.array(z.string()),
});

type FormData = z.infer<typeof formSchema>;

interface EditCourseFormProps {
  course: Course;
}

// Sortable Guide Item Component
function SortableGuideItem({
  guide,
  index,
  onRemove,
}: {
  guide: CourseGuideDisplay;
  index: number;
  onRemove: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: guide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Position Badge */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
        {index + 1}
      </div>

      {/* Cover Image */}
      <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
        <Image
          src={guide.coverImage}
          alt={guide.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Guide Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{guide.title}</h4>
        <p className="text-xs text-muted-foreground">
          {guide.pagesCount} pages • {guide.likesCount} likes
        </p>
      </div>

      {/* Actions */}
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onRemove(guide.id)}
        className="text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function EditCourseForm({ course }: EditCourseFormProps) {
  const router = useRouter();
  const PATHS = useLocalizedPaths();
  const [saving, setSaving] = useState(false);

  // Guide management
  const [guideSearchQuery, setGuideSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GuideResponse[]>([]);
  const [searching, setSearching] = useState(false);
  const [currentGuides, setCurrentGuides] = useState<CourseGuideDisplay[]>([]);
  const [loadingGuides, setLoadingGuides] = useState(true);

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

  // Professor management
  const [professorSearchQuery, setProfessorSearchQuery] = useState("");
  const [professorSearchResults, setProfessorSearchResults] = useState<
    UserSearchResult[]
  >([]);
  const [searchingProfessors, setSearchingProfessors] = useState(false);
  const [selectedProfessors, setSelectedProfessors] = useState<
    UserSearchResult[]
  >([]);
  const [showProfessorResults, setShowProfessorResults] = useState(false);
  const professorSearchRef = useRef<HTMLDivElement>(null);

  const debouncedGuideSearch = useDebounce(guideSearchQuery, 500);
  const debouncedTopicSearch = useDebounce(topicSearchQuery, 300);
  const debouncedProfessorSearch = useDebounce(professorSearchQuery, 300);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: course.title,
      description: course.description,
      coverImage: course.coverImage,
      difficultyLevel: course.difficultyLevel,
      topicIds: course.topics.map((t) => t.id),
    },
  });

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load guides
        setCurrentGuides(
          course.guides.map((g, index) => ({
            id: g.id,
            title: g.title,
            description: g.description,
            coverImage: g.coverImage,
            likesCount: g.likesCount,
            pagesCount: g.pagesCount,
            createdAt: g.createdAt,
            position: index,
          })),
        );

        // Load topics
        const topicsData = await Promise.all(
          course.topics.map((t) => TopicController.getTopicById(t.id)),
        );
        setSelectedTopics(topicsData);

        // Load professors
        // Note: You'll need to add a method to get user details by IDs
        // For now, we'll just store the IDs
        setSelectedProfessors([]);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setLoadingGuides(false);
      }
    };
    loadInitialData();
  }, [course]);

  // Search guides with debounce
  useEffect(() => {
    const searchGuides = async () => {
      if (!debouncedGuideSearch.trim()) {
        setSearchResults([]);
        return;
      }

      setSearching(true);
      try {
        const allGuides = await GuideController.getAllGuides();
        const filtered = allGuides.filter(
          (guide) =>
            guide.title
              .toLowerCase()
              .includes(debouncedGuideSearch.toLowerCase()) &&
            !currentGuides.some((g) => g.id === guide.id) &&
            guide.status === "PUBLISHED",
        );
        setSearchResults(filtered);
      } catch (error) {
        console.error("Error searching guides:", error);
      } finally {
        setSearching(false);
      }
    };

    searchGuides();
  }, [debouncedGuideSearch, currentGuides]);

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
        setTopicSearchResults(results);
        setShowTopicResults(true);
      } catch (error) {
        console.error("Error searching topics:", error);
      } finally {
        setSearchingTopics(false);
      }
    };

    searchTopics();
  }, [debouncedTopicSearch]);

  // Search professors with debounce
  useEffect(() => {
    const searchProfessors = async () => {
      if (!debouncedProfessorSearch.trim()) {
        setProfessorSearchResults([]);
        setShowProfessorResults(false);
        return;
      }

      setSearchingProfessors(true);
      try {
        const results = await AuthController.searchUsers({
          username: debouncedProfessorSearch,
        });
        const filtered = results.filter(
          (user) => !selectedProfessors.some((p) => p.id === user.id),
        );
        setProfessorSearchResults(filtered);
        setShowProfessorResults(true);
      } catch (error) {
        console.error("Error searching professors:", error);
      } finally {
        setSearchingProfessors(false);
      }
    };

    searchProfessors();
  }, [debouncedProfessorSearch, selectedProfessors]);

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
        professorSearchRef.current &&
        !professorSearchRef.current.contains(event.target as Node)
      ) {
        setShowProfessorResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddGuide = async (guide: GuideResponse) => {
    try {
      await CourseController.addGuideToCourse({
        courseId: course.id,
        guideId: guide.id,
      });

      const newGuide: CourseGuideDisplay = {
        id: guide.id,
        title: guide.title,
        description: guide.description,
        coverImage: guide.coverImage,
        likesCount: guide.likesCount,
        pagesCount: guide.pagesCount,
        createdAt: guide.createdAt,
        position: currentGuides.length,
      };

      setCurrentGuides([...currentGuides, newGuide]);
      setGuideSearchQuery("");
      setSearchResults([]);
    } catch (error) {
      console.error("Error adding guide:", error);
    }
  };

  const handleRemoveGuide = async (guideId: string) => {
    try {
      await CourseController.deleteGuideFromCourse({
        courseId: course.id,
        guideId: guideId,
      });

      setCurrentGuides(currentGuides.filter((g) => g.id !== guideId));
    } catch (error) {
      console.error("Error removing guide:", error);
    }
  };

  const handleSelectTopic = (topic: TopicResponse) => {
    if (!selectedTopics.find((t) => t.id === topic.id)) {
      const newSelectedTopics = [...selectedTopics, topic];
      setSelectedTopics(newSelectedTopics);
      form.setValue(
        "topicIds",
        newSelectedTopics.map((t) => t.id),
      );
    }
    setTopicSearchQuery("");
    setTopicSearchResults([]);
    setShowTopicResults(false);
  };

  const handleRemoveTopic = (topicId: string) => {
    const newSelectedTopics = selectedTopics.filter((t) => t.id !== topicId);
    setSelectedTopics(newSelectedTopics);
    form.setValue(
      "topicIds",
      newSelectedTopics.map((t) => t.id),
    );
  };

  const handleCreateTopic = async () => {
    if (!newTopicName.trim()) return;

    setCreatingTopic(true);
    try {
      const newTopic = await TopicController.createTopic({
        name: newTopicName,
      });
      handleSelectTopic(newTopic);
      setNewTopicName("");
      setShowCreateTopicDialog(false);
    } catch (error) {
      console.error("Error creating topic:", error);
    } finally {
      setCreatingTopic(false);
    }
  };

  const handleSelectProfessor = (professor: UserSearchResult) => {
    if (!selectedProfessors.find((p) => p.id === professor.id)) {
      setSelectedProfessors([...selectedProfessors, professor]);
    }
    setProfessorSearchQuery("");
    setProfessorSearchResults([]);
    setShowProfessorResults(false);
  };

  const handleRemoveProfessor = (professorId: string) => {
    setSelectedProfessors(
      selectedProfessors.filter((p) => p.id !== professorId),
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = currentGuides.findIndex((g) => g.id === active.id);
      const newIndex = currentGuides.findIndex((g) => g.id === over.id);

      const reorderedGuides = arrayMove(currentGuides, oldIndex, newIndex);
      const updatedGuides = reorderedGuides.map((guide, index) => ({
        ...guide,
        position: index,
      }));

      setCurrentGuides(updatedGuides);

      try {
        await CourseController.reorderCourseGuide(
          course.id,
          active.id as string,
          newIndex,
        );
      } catch (error) {
        console.error("Error updating guide order:", error);
        setCurrentGuides(currentGuides);
      }
    }
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      // Update basic course info
      const updateData: UpdateCourseRequest = {
        title: data.title,
        description: data.description,
        coverImage: data.coverImage,
        difficultyLevel: data.difficultyLevel,
        topicIds: data.topicIds,
      };

      await CourseController.updateCourse(course.id, updateData);

      // Update professors
      if (selectedProfessors.length > 0) {
        await CourseController.updateCourseAuthors(course.id, {
          authorIds: selectedProfessors.map((p) => p.id),
        });
      }

      router.push(PATHS.DASHBOARD.COURSES.VIEW(course.id));
    } catch (error) {
      console.error("Error updating course:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Save Button Fixed at Top */}
      <div className="flex justify-end sticky top-0 bg-background z-10 pb-4 border-b">
        <Button onClick={form.handleSubmit(onSubmit)} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving Changes...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="guides">
            Guides ({currentGuides.length})
          </TabsTrigger>
          <TabsTrigger value="professors">
            Professors ({selectedProfessors.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Course Details */}
        <TabsContent value="details" className="space-y-6 mt-6">
          <form className="space-y-8">
            {/* Cover Image */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold">Cover Image *</Label>
                <p className="text-sm text-muted-foreground">
                  Upload a cover image for your course
                </p>
              </div>
              <CoverDropzone
                value={form.watch("coverImage")}
                onChange={(url) => form.setValue("coverImage", url)}
              />
              {form.formState.errors.coverImage && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.coverImage.message}
                </p>
              )}
            </div>

            <Separator />

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-semibold">
                Title *
              </Label>
              <Input
                id="title"
                placeholder="Enter course title"
                {...form.register("title")}
              />
              {form.formState.errors.title && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-semibold">
                Description *
              </Label>
              <Textarea
                id="description"
                placeholder="Enter course description"
                rows={6}
                {...form.register("description")}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            {/* Difficulty Level */}
            <div className="space-y-2">
              <Label htmlFor="difficulty" className="text-base font-semibold">
                Difficulty Level *
              </Label>
              <Select
                value={form.watch("difficultyLevel")}
                onValueChange={(value) =>
                  form.setValue("difficultyLevel", value as CourseDifficulty)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(CourseDifficulty).map((level) => (
                    <SelectItem key={level} value={level}>
                      <div className="flex items-center gap-2">
                        <DifficultyBadge difficulty={level} />
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Topics */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold">Topics</Label>
                <p className="text-sm text-muted-foreground">
                  Add topics to help students find your course
                </p>
              </div>

              {/* Selected Topics */}
              {selectedTopics.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedTopics.map((topic) => (
                    <TopicBadge
                      key={topic.id}
                      topic={topic}
                      onRemove={() => handleRemoveTopic(topic.id)}
                    />
                  ))}
                </div>
              )}

              {/* Topic Search */}
              <div className="relative" ref={topicSearchRef}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search topics..."
                    value={topicSearchQuery}
                    onChange={(e) => setTopicSearchQuery(e.target.value)}
                    onFocus={() =>
                      topicSearchResults.length > 0 && setShowTopicResults(true)
                    }
                    className="pl-9"
                  />
                  {searchingTopics && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>

                {/* Topic Search Results */}
                {showTopicResults && (
                  <div className="absolute z-10 w-full mt-2 bg-popover border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {topicSearchResults.length > 0 ? (
                      <div className="p-2">
                        {topicSearchResults.map((topic) => (
                          <button
                            key={topic.id}
                            type="button"
                            onClick={() => handleSelectTopic(topic)}
                            className="w-full text-left px-3 py-2 rounded-sm hover:bg-accent transition-colors flex items-center justify-between"
                          >
                            <span>{topic.name}</span>
                            {selectedTopics.some((t) => t.id === topic.id) && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center">
                        <p className="text-sm text-muted-foreground mb-2">
                          No topics found
                        </p>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setNewTopicName(topicSearchQuery);
                            setShowCreateTopicDialog(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create "{topicSearchQuery}"
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </form>
        </TabsContent>

        {/* Tab 2: Manage Guides */}
        <TabsContent value="guides" className="space-y-6 mt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Course Guides</h3>
              <p className="text-sm text-muted-foreground">
                Add and reorder guides for this course
              </p>
            </div>

            {/* Guide Search */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search guides to add..."
                  value={guideSearchQuery}
                  onChange={(e) => setGuideSearchQuery(e.target.value)}
                  className="pl-9"
                />
                {searching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="border rounded-lg divide-y max-h-60 overflow-y-auto">
                  {searchResults.map((guide) => (
                    <button
                      key={guide.id}
                      type="button"
                      onClick={() => handleAddGuide(guide)}
                      className="w-full p-3 hover:bg-muted/50 transition-colors text-left flex items-center gap-3"
                    >
                      <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={guide.coverImage}
                          alt={guide.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{guide.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {guide.pagesCount} pages
                        </p>
                      </div>
                      <Plus className="h-5 w-5 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Current Guides List */}
            <div className="space-y-3">
              <h4 className="font-medium">
                Current Guides ({currentGuides.length})
              </h4>

              {loadingGuides ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : currentGuides.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <p className="text-muted-foreground">No guides added yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Search and add guides above
                  </p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={currentGuides.map((g) => g.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {currentGuides.map((guide, index) => (
                        <SortableGuideItem
                          key={guide.id}
                          guide={guide}
                          index={index}
                          onRemove={handleRemoveGuide}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Manage Professors */}
        <TabsContent value="professors" className="space-y-6 mt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Course Professors</h3>
              <p className="text-sm text-muted-foreground">
                Add professors who can teach this course
              </p>
            </div>

            {/* Professor Search */}
            <div className="relative" ref={professorSearchRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search professors by username..."
                  value={professorSearchQuery}
                  onChange={(e) => setProfessorSearchQuery(e.target.value)}
                  onFocus={() =>
                    professorSearchResults.length > 0 &&
                    setShowProfessorResults(true)
                  }
                  className="pl-9"
                />
                {searchingProfessors && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>

              {/* Professor Search Results */}
              {showProfessorResults && professorSearchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-popover border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  <div className="p-2">
                    {professorSearchResults.map((professor) => (
                      <button
                        key={professor.id}
                        type="button"
                        onClick={() => handleSelectProfessor(professor)}
                        className="w-full text-left px-3 py-2 rounded-sm hover:bg-accent transition-colors flex items-center gap-3"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={professor.profilePicture}
                            alt={professor.username}
                          />
                          <AvatarFallback>
                            {professor.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {professor.username}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            @{professor.username}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Selected Professors */}
            <div className="space-y-3">
              <h4 className="font-medium">
                Selected Professors ({selectedProfessors.length})
              </h4>

              {selectedProfessors.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <User className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    No professors added yet
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Search and add professors above
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedProfessors.map((professor) => (
                    <div
                      key={professor.id}
                      className="flex items-center gap-3 p-4 border rounded-lg bg-card"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={professor.profilePicture}
                          alt={professor.username}
                        />
                        <AvatarFallback>
                          {professor.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{professor.username}</p>
                        <p className="text-sm text-muted-foreground">
                          @{professor.username} • {professor.email}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveProfessor(professor.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Topic Dialog */}
      <Dialog
        open={showCreateTopicDialog}
        onOpenChange={setShowCreateTopicDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Topic</DialogTitle>
            <DialogDescription>
              Create a new topic to categorize your course
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="topicName">Topic Name</Label>
              <Input
                id="topicName"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                placeholder="Enter topic name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateTopicDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateTopic} disabled={creatingTopic}>
              {creatingTopic ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Topic"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function EditCourseSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <Skeleton className="h-10 w-32 ml-auto" />
      <Skeleton className="h-12 w-full max-w-2xl" />
      <div className="space-y-8">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
