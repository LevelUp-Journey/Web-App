# Pages Editor Update - Inline Editing Implementation

## 🎯 Overview

The guide pages editor has been completely redesigned to provide an inline editing experience instead of using modal dialogs. This provides a more intuitive and streamlined workflow for managing guide content.

## 🔄 What Changed

### Before (Modal-Based)
- Pages listed in main content area
- Clicking "Edit" opened a modal dialog
- Editor isolated from page context
- Had to close modal to see page list
- Context switching between list and editor

### After (Inline Editor)
- **Split-pane interface**: Pages list (left) + Editor (right)
- **Persistent editor**: Always visible, no modals
- **Live selection**: Click page to edit immediately
- **Visual feedback**: Selected page highlighted
- **Unsaved changes tracking**: Clear indicators when content modified

## 🎨 New UI Layout

```
┌─────────────────────────────────────────────────────┐
│                    Edit Guide                        │
├──────────────┬──────────────────────────────────────┤
│  Pages (3)   │        Page 1 Editor                 │
├──────────────┤                                      │
│ [+ Add Page] │  ┌─────────────────────────────┐   │
│              │  │                             │   │
│  ┌─────────┐ │  │   Markdown Editor          │   │
│  │ Page 1  │ │  │   (ShadcnTemplate)         │   │
│  └─────────┘ │  │                             │   │
│   Page 2     │  │                             │   │
│   Page 3     │  │                             │   │
│              │  └─────────────────────────────┘   │
│              │                                      │
│  [ Done ]    │  [Discard] [Save Page]              │
└──────────────┴──────────────────────────────────────┘
```

## 📝 Key Features

### 1. Left Sidebar - Pages List
- **Width**: Fixed 320px with border separator
- **Header**: Shows total page count
- **Add Button**: Quick access to create new page
- **Draggable Pages**: Reorder with drag handles
- **Selection**: Click to edit, highlighted when active
- **Mini Preview**: Shows content snippet (50 chars)
- **Delete Button**: Quick remove with confirmation
- **Done Button**: Exit with unsaved changes warning

### 2. Right Panel - Editor
- **Header Bar**:
  - Page number and status (saved/unsaved)
  - Discard button (when changes exist)
  - Save button (enabled when modified)
- **Full Editor**: ShadcnTemplate markdown editor
- **Change Tracking**: Detects modifications automatically
- **Empty State**: Helpful prompt when no page selected

### 3. Unsaved Changes Management
- **Detection**: Tracks modifications vs initial content
- **Warnings**: Prevents accidental data loss
- **Indicators**: 
  - Yellow text "You have unsaved changes"
  - Disabled "Done" button when unsaved
  - Save button highlights

## 🔧 Technical Implementation

### Component Structure

```typescript
<PagesForm>
  <LeftSidebar>
    <Header>Pages (count)</Header>
    <AddButton />
    <ScrollArea>
      <DndContext>
        <SortablePageItem /> // Repeated for each page
      </DndContext>
    </ScrollArea>
    <Footer>
      <DoneButton />
      <UnsavedWarning />
    </Footer>
  </LeftSidebar>
  
  <RightEditor>
    {selectedPage ? (
      <>
        <EditorHeader>
          <PageInfo />
          <Actions>
            <DiscardButton />
            <SaveButton />
          </Actions>
        </EditorHeader>
        <ShadcnTemplate />
      </>
    ) : (
      <EmptyState />
    )}
  </RightEditor>
</PagesForm>
```

### State Management

```typescript
// Core state
const [pages, setPages] = useState<PageData[]>([]);
const [selectedPage, setSelectedPage] = useState<PageData | null>(null);
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
const [editorMethods, setEditorMethods] = useState<ShadcnTemplateRef | null>(null);

// Track initial content for comparison
const initialContentRef = useRef<string>("");
```

### Editor Integration

The ShadcnTemplate component provides:
- `onReady(methods)`: Callback with editor methods
- `methods.injectMarkdown(content)`: Load content into editor
- `methods.getMarkdown()`: Get current content

```typescript
// Initialize editor
const handleEditorReady = useCallback((methods: ShadcnTemplateRef) => {
  setEditorMethods(methods);
}, []);

// Load page content
useEffect(() => {
  if (selectedPage && editorMethods) {
    initialContentRef.current = selectedPage.content;
    editorMethods.injectMarkdown(selectedPage.content || "");
    setHasUnsavedChanges(false);
  }
}, [selectedPage, editorMethods]);

// Track changes
const handleContentChange = useCallback(() => {
  if (editorMethods) {
    const currentContent = editorMethods.getMarkdown();
    if (currentContent !== initialContentRef.current) {
      setHasUnsavedChanges(true);
    }
  }
}, [editorMethods]);
```

## 🎬 User Workflows

### Create New Page
1. Click "Add Page" button
2. New page appears in list (marked "Not saved")
3. Editor opens automatically
4. User writes content
5. Click "Save Page"
6. Page persists to server
7. List updates with saved page ID

### Edit Existing Page
1. Click page in list
2. Editor loads content
3. User modifies content
4. "Save Page" button enables
5. Click save to persist
6. Content updates in list preview

### Reorder Pages
1. Grab drag handle (⋮⋮)
2. Drag page to new position
3. Drop in place
4. Order updates immediately in backend
5. Page numbers recalculate

### Delete Page
1. Click trash icon on page
2. Confirm deletion
3. Page removes from list
4. Remaining pages reorder
5. If deleted page was selected, first page selected
6. Backend updates all page positions

### Navigate with Unsaved Changes
1. User modifies page content
2. Tries to select different page
3. Warning: "You have unsaved changes. Discard?"
4. User confirms or cancels
5. Action proceeds or stays on current page

## 🚨 Error Handling

### Save Failures
- Alert with error message
- Content remains in editor
- User can retry save
- No data lost

### Delete Failures
- Alert with error message
- Page remains in list
- Can retry delete

### Empty Content
- Validates before save
- Shows alert: "Content cannot be empty"
- Prevents creating empty pages

## ♿ Accessibility

- **Keyboard Navigation**: Tab through pages, Enter to select
- **Drag Keyboard Support**: Arrow keys to reorder (via @dnd-kit)
- **Screen Readers**: ARIA labels on all interactive elements
- **Focus Management**: Maintains focus context during operations

## 📱 Responsive Design

- **Desktop (>1024px)**: Full split-pane view
- **Tablet (768-1024px)**: Narrow sidebar, full editor
- **Mobile (<768px)**: *Consider adding tab toggle between list/editor*

## 🔄 API Interactions

### Create Page
```typescript
POST /guides/{guideId}/pages
Body: { content: string, order: number }
Response: GuideResponse (with all pages)
```

### Update Page
```typescript
PUT /guides/{guideId}/pages/{pageId}
Body: { content: string, order: number }
Response: GuideResponse
```

### Delete Page
```typescript
DELETE /guides/{guideId}/pages/{pageId}
Response: GuideResponse
```

All operations return full guide data, ensuring sync.

## 🎨 Styling Details

### Colors & States
- **Inactive Page**: `bg-card` with `hover:bg-muted/50`
- **Active Page**: `bg-primary/10 border-primary`
- **Unsaved Warning**: `text-amber-600 dark:text-amber-400`
- **Drag Handle**: `text-muted-foreground`
- **Position Badge**: `bg-primary/10` with number

### Spacing
- Sidebar: `w-80` (320px)
- Padding: `p-4` (16px) consistent throughout
- Gap: `gap-2` or `gap-3` for list items
- Border: `border-r` for sidebar separator

## 🐛 Known Limitations

1. **Change Detection**: Currently tracks on click/keydown events. More granular tracking could be implemented with editor plugins.

2. **Concurrent Editing**: No real-time collaboration. Multiple users editing same guide may cause conflicts.

3. **Auto-Save**: Not implemented. Consider adding auto-save draft functionality.

4. **Undo/Redo**: Handled by editor component, but doesn't sync with page switching.

5. **Image Uploads**: Handled by editor, but may need specific guide-scoped folder organization.

## 🚀 Future Enhancements

### Short Term
- [ ] Auto-save drafts every 30 seconds
- [ ] Keyboard shortcuts (Ctrl+S to save)
- [ ] Bulk operations (duplicate, move multiple)
- [ ] Page templates library

### Medium Term
- [ ] Version history per page
- [ ] Page-level comments/notes
- [ ] Search across page content
- [ ] Rich media embeds (videos, interactive widgets)

### Long Term
- [ ] Real-time collaborative editing
- [ ] AI-assisted content suggestions
- [ ] Accessibility checker
- [ ] Preview mode with guide styling

## 📚 Related Components

- **ShadcnTemplate**: `/components/challenges/editor/lexkitEditor.tsx`
- **ScrollArea**: `/components/ui/scroll-area.tsx` (newly created)
- **DnD Kit**: `@dnd-kit/core` and `@dnd-kit/sortable`

## 🧪 Testing Recommendations

### Unit Tests
- [ ] Page list renders correctly
- [ ] Selection state updates
- [ ] Unsaved changes detection
- [ ] Drag and drop reordering

### Integration Tests
- [ ] Create page flow
- [ ] Edit and save page
- [ ] Delete page with confirmation
- [ ] Navigate with unsaved changes

### E2E Tests
- [ ] Complete guide creation workflow
- [ ] Multi-page guide with reordering
- [ ] Error scenarios (network failures)
- [ ] Browser back/forward navigation

## 📊 Performance Considerations

- **Editor Initialization**: ShadcnTemplate mounts once, content injected on selection
- **List Rendering**: Uses `key={page.id}` for efficient React reconciliation
- **Drag Performance**: @dnd-kit optimized for large lists
- **API Calls**: Batched where possible (reorder updates)

## 🔐 Security Notes

- All content sanitized before save
- Markdown parsing on render (not in editor)
- XSS protection via editor component
- Authentication required for all page operations

## 📝 Migration Notes

### For Developers
- Remove modal dialog dependencies (Dialog components)
- Update any direct calls to old modal-based flow
- Test thoroughly with existing guides

### For Users
- No action needed - interface improves automatically
- Existing guides load seamlessly
- All shortcuts/workflows still work

## ✅ Completion Checklist

- [x] Remove modal dialog
- [x] Implement split-pane layout
- [x] Add page selection logic
- [x] Track unsaved changes
- [x] Implement inline editor
- [x] Add keyboard support
- [x] Style active/inactive states
- [x] Handle edge cases (no pages, empty content)
- [x] Test drag and drop
- [x] Document changes

---

**Date**: 2025  
**Version**: 2.0.0  
**Status**: ✅ Complete  
**Breaking Changes**: None (UI only, API unchanged)