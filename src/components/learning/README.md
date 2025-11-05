# Learning Components

This directory contains reusable components for the learning management system, including guides, courses, topics, and related functionality.

## Components Overview

### 📛 Badge Components

#### `difficulty-badge.tsx`
Displays course difficulty levels with color-coded visual indicators.

**Props:**
```typescript
interface DifficultyBadgeProps {
  difficulty: CourseDifficulty;
  className?: string;
}
```

**Difficulty Levels:**
- `BEGINNER` - Green badge
- `INTERMEDIATE` - Blue badge
- `ADVANCED` - Orange badge
- `EXPERT` - Red badge

**Usage:**
```tsx
import { DifficultyBadge } from "@/components/learning/difficulty-badge";
import { CourseDifficulty } from "@/services/internal/learning/courses/domain/course.entity";

<DifficultyBadge difficulty={CourseDifficulty.INTERMEDIATE} />
```

#### `topic-badge.tsx`
Displays topic tags with optional remove functionality.

**Props:**
```typescript
interface TopicBadgeProps {
  topic: {
    id: string;
    name: string;
  };
  className?: string;
  onRemove?: () => void;
}
```

**Usage:**
```tsx
import { TopicBadge } from "@/components/learning/topic-badge";

// Read-only badge
<TopicBadge topic={{ id: "1", name: "React" }} />

// With remove functionality
<TopicBadge 
  topic={{ id: "1", name: "React" }}
  onRemove={() => handleRemove("1")}
/>
```

---

### 📝 Form Components

#### `edit-course-form.tsx`
Complete course editing interface with three tabbed sections.

**Props:**
```typescript
interface EditCourseFormProps {
  course: Course;
}
```

**Features:**
- **Tab 1: Course Details**
  - Cover image upload (drag-and-drop)
  - Title and description fields
  - Difficulty level selector
  - Topic management with search
  - Create new topics on-the-fly

- **Tab 2: Manage Guides**
  - Search and add guides
  - Drag-and-drop reordering
  - Remove guides
  - Real-time position updates

- **Tab 3: Manage Professors**
  - Search users by username
  - Add/remove professors
  - Display professor profiles

**Usage:**
```tsx
import { EditCourseForm } from "@/components/learning/edit-course-form";

export default async function EditCoursePage({ params }) {
  const course = await CourseController.getCourseById(params.courseId);
  
  return <EditCourseForm course={course} />;
}
```

**Technical Details:**
- Form validation with Zod schema
- Debounced search (300ms for topics/professors, 500ms for guides)
- Optimistic UI updates
- Automatic persistence to server
- Click-outside-to-close dropdowns
- Loading states for all async operations

#### `cover-dropzone.tsx`
Image upload component with drag-and-drop functionality.

**Props:**
```typescript
interface CoverDropzoneProps {
  // Legacy pattern
  onImageUrlChange?: (url: string) => void;
  currentImage?: string | null;
  
  // New pattern (recommended)
  onChange?: (url: string) => void;
  value?: string;
  
  disabled?: boolean;
  className?: string;
  aspectRatio?: "video" | "wide" | "ultrawide"; // 16:9, 21:9, 32:9
}
```

**Usage:**
```tsx
import { CoverDropzone } from "@/components/learning/cover-dropzone";

// With react-hook-form
<CoverDropzone
  value={form.watch("coverImage")}
  onChange={(url) => form.setValue("coverImage", url)}
/>

// Legacy usage
<CoverDropzone
  currentImage={imageUrl}
  onImageUrlChange={setImageUrl}
/>
```

**Features:**
- Automatic upload to Cloudinary
- Drag-and-drop support
- Preview of current image
- Hover overlay for re-upload
- Loading states
- 10MB file size limit
- Accepts all image formats

---

### 📚 Guide Components

Located in `guide/` subdirectory:

#### `basic-info-form.tsx`
Form for guide metadata (title, description, cover, topics).

**Props:**
```typescript
interface BasicInfoFormProps {
  form: UseFormReturn<BasicInfoFormData>;
  onSubmit: (data: BasicInfoFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitButtonText?: string;
  submitButtonLoadingText?: string;
}
```

#### `pages-form.tsx`
Form for managing guide pages with markdown editor.

**Props:**
```typescript
interface PagesFormProps {
  guideId: string;
  initialPages: PageData[];
  onFinish: () => void;
}
```

---

### 👤 User Components

#### `guide-author-card.tsx`
Displays guide author information.

#### `guide-like-button.tsx`
Interactive like button for guides.

---

## Design Patterns

### 1. Controlled vs Uncontrolled Components

All form components support controlled pattern:
```tsx
// Controlled (recommended)
<Input value={value} onChange={setValue} />

// Works with react-hook-form
<Input {...register("fieldName")} />
```

### 2. Optimistic Updates

Components update UI immediately and persist to server:
```tsx
// Update UI first
setItems([...items, newItem]);

// Then persist
await Controller.addItem(newItem);
```

### 3. Loading States

All async operations have loading states:
```tsx
{loading ? <Skeleton /> : <Content />}
{searching && <Spinner />}
```

### 4. Error Handling

Components handle errors gracefully:
```tsx
try {
  await action();
} catch (error) {
  console.error(error);
  toast.error("Operation failed");
}
```

---

## Styling

### Conventions

- **Tailwind CSS** for all styling
- **shadcn/ui** components as base
- **Dark mode** support required
- **Responsive** design (mobile-first)

### Color Scheme

**Difficulty Badges:**
- Beginner: `green-100/800` (light/dark)
- Intermediate: `blue-100/800`
- Advanced: `orange-100/800`
- Expert: `red-100/800`

**Topic Badges:**
- Background: `purple-100/900`
- Text: `purple-800/100`

**Interactive States:**
- Hover: `hover:bg-muted/50`
- Active: `active:opacity-80`
- Disabled: `opacity-50 pointer-events-none`

---

## Best Practices

### 1. TypeScript
Always define prop interfaces:
```typescript
interface ComponentProps {
  required: string;
  optional?: number;
}
```

### 2. Accessibility
- Use semantic HTML
- Add ARIA labels where needed
- Support keyboard navigation
- Focus management in modals

### 3. Performance
- Debounce search inputs
- Lazy load heavy components
- Memoize expensive calculations
- Use proper React keys in lists

### 4. Error Boundaries
Wrap async operations:
```tsx
try {
  await operation();
  toast.success("Success!");
} catch (error) {
  toast.error("Failed");
}
```

---

## Dependencies

### Required
- `react` - UI framework
- `react-hook-form` - Form management
- `zod` - Schema validation
- `@dnd-kit/core` + `@dnd-kit/sortable` - Drag and drop
- `lucide-react` - Icons
- `sonner` - Toast notifications

### Optional
- `next-mdx-remote-client` - For MDX rendering in guides
- `cloudinary` - Image uploads

---

## Testing

### Unit Tests
Test each component in isolation:
```tsx
describe('DifficultyBadge', () => {
  it('renders correct color for difficulty', () => {
    const { container } = render(
      <DifficultyBadge difficulty={CourseDifficulty.EXPERT} />
    );
    expect(container).toHaveClass('bg-red-100');
  });
});
```

### Integration Tests
Test component interactions:
```tsx
describe('EditCourseForm', () => {
  it('adds guide to course', async () => {
    render(<EditCourseForm course={mockCourse} />);
    
    await userEvent.type(screen.getByPlaceholder('Search guides'), 'React');
    await userEvent.click(screen.getByText('React Basics'));
    
    expect(screen.getByText('React Basics')).toBeInTheDocument();
  });
});
```

---

## Common Issues

### Issue: Drag and drop not working
**Solution:** Ensure parent doesn't have conflicting event handlers

### Issue: Form validation not triggering
**Solution:** Check Zod schema matches form structure

### Issue: Search too slow
**Solution:** Increase debounce delay or add search indexing

### Issue: Images not uploading
**Solution:** Check Cloudinary credentials in environment variables

---

## Contributing

When adding new components:

1. ✅ Follow existing naming conventions
2. ✅ Add TypeScript interfaces
3. ✅ Include JSDoc comments
4. ✅ Support dark mode
5. ✅ Make responsive
6. ✅ Add to this README
7. ✅ Write tests
8. ✅ Update changelog

---

## Changelog

### v1.0.0 (2025)
- ✨ Initial release
- ✨ DifficultyBadge component
- ✨ TopicBadge component
- ✨ EditCourseForm with 3 tabs
- ✨ Enhanced CoverDropzone with dual prop pattern
- 🐛 Fixed form validation issues
- 📝 Complete documentation

---

## License

Internal use only - Part of LevelUpJourney platform