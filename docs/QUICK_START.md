# Quick Start Guide - Guide & Course Management

## 🚀 Getting Started

This guide will help you quickly understand and use the new guide and course management features.

## 📋 Prerequisites

- User with `ROLE_TEACHER` or `ROLE_ADMIN` permissions
- Active authentication session
- Access to `/dashboard/admin` routes

---

## 🎯 Common Tasks

### 1. Edit a Course

**Navigate to:** `/dashboard/admin/courses/edit/[courseId]`

#### Tab 1: Course Details
```typescript
// Update basic information
1. Upload cover image (drag & drop or click)
2. Edit title (min 5 characters)
3. Edit description (min 10 characters)
4. Select difficulty level (BEGINNER, INTERMEDIATE, ADVANCED, EXPERT)
5. Add/remove topics (search or create new)
```

#### Tab 2: Manage Guides
```typescript
// Add guides to course
1. Search for guides by name
2. Click guide to add to course
3. Drag & drop to reorder
4. Click X to remove guide
```

#### Tab 3: Manage Professors
```typescript
// Add professors to course
1. Search by username
2. Click professor to add
3. Click X to remove professor
4. Save changes
```

**Save:** Click "Save Changes" button (sticky at top)

---

### 2. Browse Guides with Pagination

**Navigate to:** `/dashboard/admin/guides`

```typescript
// View and navigate guides
1. See current page of guides (default: 9 per page)
2. Change page size (6, 9, 12, 18, 24)
3. Navigate: Previous | 1 2 3 ... 10 | Next
4. See results counter: "Showing 1 to 9 of 45 guides"
```

**Features:**
- ✅ Fast loading (server-side pagination)
- ✅ Smart ellipsis (first, last, current ± 1)
- ✅ Responsive grid (1-3 columns)
- ✅ Loading skeletons
- ✅ Empty/error states

---

### 3. Search for Professors

**Endpoint:** `GET /api/v1/profiles/search?username={username}`

```typescript
// In your code
const results = await AuthController.searchUsers({
  username: "john"
});

// Results include:
// - id, username, email
// - firstName, lastName
// - profilePicture
```

---

## 🎨 Using New Components

### DifficultyBadge

```tsx
import { DifficultyBadge } from "@/components/learning/difficulty-badge";
import { CourseDifficulty } from "@/services/internal/learning/courses/domain/course.entity";

<DifficultyBadge difficulty={CourseDifficulty.INTERMEDIATE} />
```

**Result:** 🔵 Blue badge with "Intermediate"

### TopicBadge

```tsx
import { TopicBadge } from "@/components/learning/topic-badge";

// Read-only
<TopicBadge topic={{ id: "1", name: "React" }} />

// With remove
<TopicBadge 
  topic={{ id: "1", name: "React" }}
  onRemove={() => handleRemove("1")}
/>
```

**Result:** 🟣 Purple badge with optional X button

---

## 🔍 API Reference

### Guide Pagination

```typescript
// Get paginated guides
const response = await GuideController.getGuidesPaginated({
  page: 0,        // Page number (0-indexed)
  size: 10,       // Items per page
  sort: "createdAt,desc"  // Sort field and direction
});

// Response structure
{
  content: GuideResponse[],
  totalPages: number,
  totalElements: number,
  pageable: { ... },
  // ... more metadata
}
```

### User Search

```typescript
// Search users by username
const users = await AuthController.searchUsers({
  username: "search_term"
});

// Returns: UserSearchResult[]
```

### Course Operations

```typescript
// Update course
await CourseController.updateCourse(courseId, {
  title: string,
  description: string,
  coverImage: string,
  difficultyLevel: CourseDifficulty,
  topicIds: string[]
});

// Add guide to course
await CourseController.addGuideToCourse({
  courseId: string,
  guideId: string
});

// Reorder guide
await CourseController.reorderCourseGuide(
  courseId,
  guideId,
  newPosition
);

// Update authors (professors)
await CourseController.updateCourseAuthors(courseId, {
  authorIds: string[]
});
```

---

## 💡 Tips & Tricks

### Performance

1. **Debouncing**: Search inputs are debounced (300-500ms)
2. **Pagination**: Use appropriate page sizes for your data
3. **Optimistic Updates**: UI updates immediately, server syncs after

### UX Best Practices

1. **Loading States**: Always show loading indicators
2. **Error Handling**: Provide retry options on errors
3. **Empty States**: Guide users with clear CTAs
4. **Validation**: Show errors inline, not just on submit

### Common Patterns

```typescript
// Debounced search
const [query, setQuery] = useState("");
const debouncedQuery = useDebounce(query, 300);

useEffect(() => {
  if (!debouncedQuery) return;
  // Perform search
}, [debouncedQuery]);

// Pagination state
const [page, setPage] = useState(0);
const [size, setSize] = useState(10);
const [total, setTotal] = useState(0);

// Click outside to close
const ref = useRef<HTMLDivElement>(null);

useEffect(() => {
  const handleClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setOpen(false);
    }
  };
  
  document.addEventListener("mousedown", handleClick);
  return () => document.removeEventListener("mousedown", handleClick);
}, []);
```

---

## 🐛 Troubleshooting

### Issue: Changes not saving
**Check:**
- Are you authenticated?
- Do you have proper permissions (TEACHER/ADMIN)?
- Check browser console for errors
- Verify network requests in DevTools

### Issue: Search not working
**Check:**
- Is the search query long enough?
- Wait for debounce (300-500ms)
- Check if API endpoint is reachable
- Verify user has search permissions

### Issue: Pagination not loading
**Check:**
- Backend returns correct format (content, totalPages, etc.)
- Page/size parameters are valid
- Network tab shows successful requests
- No JavaScript errors in console

### Issue: Drag & drop not working
**Check:**
- Using mouse/touch (keyboard uses arrows)
- Element is not inside another draggable
- No conflicting event listeners
- Browser supports DnD API

---

## 📚 Further Reading

- [CHANGES_SUMMARY.md](./CHANGES_SUMMARY.md) - Complete technical documentation
- [RESUMEN_CAMBIOS.md](./RESUMEN_CAMBIOS.md) - Spanish version
- [Components README](../src/components/learning/README.md) - Component documentation

---

## ⚡ Quick Commands

```bash
# Development server
bun dev

# Type check
bun run type-check

# Build production
bun run build

# Run tests
bun test
```

---

## 🎓 Examples

### Complete Course Edit Flow

```typescript
// 1. Fetch course
const course = await CourseController.getCourseById({ courseId });

// 2. Update basic info
await CourseController.updateCourse(courseId, {
  title: "Advanced React Patterns",
  description: "Learn advanced React patterns...",
  coverImage: "https://...",
  difficultyLevel: CourseDifficulty.ADVANCED,
  topicIds: ["topic-1", "topic-2"]
});

// 3. Add guides
await CourseController.addGuideToCourse({
  courseId,
  guideId: "guide-1"
});

// 4. Reorder guides
await CourseController.reorderCourseGuide(
  courseId,
  "guide-1",
  0 // new position
);

// 5. Add professors
await CourseController.updateCourseAuthors(courseId, {
  authorIds: ["prof-1", "prof-2"]
});
```

### Pagination Component Usage

```tsx
function GuidesPage() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(9);
  const [guides, setGuides] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  
  useEffect(() => {
    const load = async () => {
      const response = await GuideController.getGuidesPaginated({
        page,
        size,
        sort: "createdAt,desc"
      });
      
      setGuides(response.content);
      setTotalPages(response.totalPages);
    };
    
    load();
  }, [page, size]);
  
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3">
        {guides.map(guide => <GuideCard key={guide.id} guide={guide} />)}
      </div>
      
      <Pagination>
        <PaginationPrevious 
          onClick={() => setPage(p => p - 1)}
          className={page === 0 ? "pointer-events-none opacity-50" : ""}
        />
        {/* Page numbers */}
        <PaginationNext 
          onClick={() => setPage(p => p + 1)}
          className={page === totalPages - 1 ? "pointer-events-none opacity-50" : ""}
        />
      </Pagination>
    </div>
  );
}
```

---

## 🎯 Checklist for New Features

When adding similar functionality:

- [ ] Define TypeScript interfaces
- [ ] Create controller methods
- [ ] Add server actions
- [ ] Implement UI components
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add empty states
- [ ] Test with real data
- [ ] Test edge cases
- [ ] Update documentation
- [ ] Add to this guide

---

**Last Updated:** 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready