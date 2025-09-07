# TaskFlow Quickstart Guide

This guide validates the core user scenarios from the feature specification through step-by-step testing.

## Prerequisites

- Node.js 18+ installed
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for initial setup

## Setup Instructions

1. **Initialize Next.js Project**
   ```bash
   npx create-next-app@latest taskflow --typescript --app
   cd taskflow
   ```

2. **Install Dependencies**
   ```bash
   # Install Tailwind CSS 4.0+ (alpha/beta version)
   npm install tailwindcss@next @tailwindcss/vite@next
   
   # Install other dependencies
   npm install uuid
   npm install --save-dev @types/uuid
   
   # Install Vitest for testing
   npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
   ```

3. **Configure Tailwind CSS 4.0 with CSS First**
   ```bash
   # Create CSS configuration file
   touch src/app/globals.css
   ```
   
   Add to `src/app/globals.css`:
   ```css
   @import "tailwindcss";
   
   @theme {
     --color-primary-50: #eff6ff;
     --color-primary-500: #3b82f6;
     --color-primary-900: #1e3a8a;
     
     --font-family-display: ui-serif, serif;
     --font-size-xs: 0.75rem;
     --font-size-sm: 0.875rem;
   }
   
   @layer base {
     :root {
       --background: 0 0% 100%;
       --foreground: 222.2 84% 4.9%;
     }
   }
   ```

4. **Configure Vitest**
   Add to `package.json`:
   ```json
   {
     "scripts": {
       "test": "vitest",
       "test:ui": "vitest --ui",
       "test:run": "vitest run"
     }
   }
   ```
   
   Create `vitest.config.ts`:
   ```typescript
   import { defineConfig } from 'vitest/config'
   import react from '@vitejs/plugin-react'
   
   export default defineConfig({
     plugins: [react()],
     test: {
       environment: 'jsdom',
       setupFiles: ['./test-setup.ts']
     }
   })
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Open in Browser**
   Navigate to `http://localhost:3000`

## Page Navigation Tests

### Test P1: Homepage Navigation and Overview
**Scenario**: User visits the homepage and sees app overview

**Steps**:
1. Navigate to `http://localhost:3000/`
2. Verify homepage displays app title and overview
3. Check quick statistics display (total, completed, pending, overdue tasks)
4. Verify recent tasks section shows up to 5 recent tasks
5. Click "View All Tasks" button
6. Verify navigation to `/tasks` page

**Expected Result**:
- Homepage loads with clear app branding and navigation
- Quick stats accurately reflect current task data
- Recent tasks show properly formatted task previews
- Navigation to tasks page preserves user context

### Test P2: Tasks List Page Full Functionality
**Scenario**: User manages tasks on the main tasks page

**Steps**:
1. Navigate to `/tasks` 
2. Verify URL reflects current filter state
3. Create a new task using the floating action button
4. Apply various filters and verify URL updates
5. Select multiple tasks and perform bulk operations
6. Click on a task to navigate to detail view

**Expected Result**:
- Tasks list displays with proper filtering controls
- URL state synchronization works bidirectionally
- All functional requirements work within page context
- Navigation to task detail maintains filter context

### Test P3: Task Detail Page Operations
**Scenario**: User views and edits individual task details

**Steps**:
1. Navigate to `/tasks/[specific-task-id]`
2. Verify task details display completely
3. Edit task title and description inline
4. Navigate between previous/next tasks
5. Use "Back to Tasks" navigation
6. Test keyboard shortcuts within detail view

**Expected Result**:
- Task detail loads with complete information
- Edit operations work smoothly with real-time updates  
- Navigation preserves filter context from tasks page
- Breadcrumb navigation functions correctly

## Core User Scenario Tests

### Test 1: Create First Task (FR-001)
**Scenario**: User with no existing tasks creates their first task

**Steps**:
1. Open TaskFlow application
2. Click "New Task" button or press Ctrl+N (Cmd+N on Mac)
3. Enter task title: "Complete project report"
4. Enter description: "Finish the quarterly project status report"
5. Set due date: "2025-09-10"
6. Set priority: "High"
7. Set category: "Work"
8. Click "Save" or press Ctrl+S (Cmd+S on Mac)

**Expected Result**: 
- Task appears in task list with title "Complete project report"
- Status shows "Not Completed"
- Due date shows "September 10, 2025"
- Priority badge shows "High" (red color)
- Category badge shows "Work"

### Test 2: Filter by Category (FR-013)
**Scenario**: User with multiple tasks filters by specific category

**Setup**: Create additional tasks in different categories
- "Buy groceries" (Category: Personal)
- "Review pull requests" (Category: Work)
- "Call dentist" (Category: Personal)

**Steps**:
1. In the filter panel, select "Work" category filter
2. Observe task list updates

**Expected Result**:
- Only tasks with "Work" category are displayed
- Task count shows filtered count
- "Complete project report" and "Review pull requests" are visible
- Personal tasks are hidden

### Test 3: Mark Task Complete (FR-004)
**Scenario**: User marks completed tasks as done

**Steps**:
1. Find "Buy groceries" task in the list
2. Click the checkbox next to the task title
3. Alternatively: Select task and press Ctrl+D (Cmd+D on Mac)

**Expected Result**:
- Task checkbox becomes checked ✓
- Task title gets strikethrough styling
- Task moves to bottom of list (if sorted by completion)
- Completed timestamp is recorded

### Test 4: Sort by Priority (FR-010)
**Scenario**: User sorts tasks by priority to focus on important items

**Steps**:
1. Create tasks with different priorities:
   - "Urgent client call" (High priority)
   - "Update documentation" (Medium priority) 
   - "Organize desk" (Low priority)
2. Click on "Priority" column header or use sort dropdown
3. Select "Priority" as sort criteria

**Expected Result**:
- High priority tasks appear at the top (red badges)
- Medium priority tasks in the middle (yellow badges)
- Low priority tasks at the bottom (green badges)
- Visual priority indicators are clearly visible

### Test 5: Bulk Operations (FR-015, FR-020)
**Scenario**: User selects multiple tasks for bulk operations

**Steps**:
1. Create 5 test tasks
2. Hold Ctrl/Cmd and click on 3 tasks to select them
3. Verify selection count shows "3 selected"
4. Click "Mark Complete" in bulk actions panel
5. Verify all selected tasks become completed

**Edge Case Test**: 
1. Try to select more than 50 tasks (create additional test data)
2. Verify selection stops at 50 with warning message

**Expected Result**:
- Selected tasks have visual selection indicator
- Bulk actions panel appears with available operations
- Maximum 50 tasks can be selected (FR-020 requirement)
- Selected operations apply to all selected tasks

### Test 6: Overdue Tasks Highlighting (FR-009)
**Scenario**: User sees visual indication of overdue tasks

**Steps**:
1. Create task with due date in the past: "Yesterday's task" (due: yesterday)
2. Create task with today's due date: "Today's deadline"
3. Create task with future due date: "Future meeting"

**Expected Result**:
- Past due task has red background/border or warning icon
- Today's task has yellow/orange highlighting
- Future task has normal styling
- Overdue indicator is clearly visible and accessible

### Test 7: Search Functionality (FR-011)
**Scenario**: User searches for specific tasks by keyword

**Steps**:
1. Create tasks with varied titles and descriptions
2. In search box, type "project"
3. Observe filtered results
4. Clear search and type "call"
5. Verify search works across titles and descriptions

**Expected Result**:
- Search filters tasks in real-time as user types
- Results include matches from both title and description
- Search is case-insensitive
- Clear search button resets to full list

### Test 8: Keyboard Shortcuts (FR-016)
**Scenario**: User uses keyboard shortcuts for efficient task management

**Test Each Shortcut**:
1. **Ctrl+N (Cmd+N)**: Opens new task form
2. **Ctrl+S (Cmd+S)**: Saves current task (when editing)
3. **Escape**: Cancels edit mode and closes dialogs
4. **Ctrl+D (Cmd+D)**: Toggles selected task completion
5. **Ctrl+Delete (Cmd+Delete)**: Deletes selected task

**Expected Result**:
- All shortcuts work as specified
- Mac users see Cmd instead of Ctrl in help text
- Shortcuts are disabled when typing in input fields
- Help tooltip shows available shortcuts

### Test 9: Responsive Design (FR-017)
**Scenario**: User accesses TaskFlow on different devices

**Steps**:
1. Test on desktop (>1024px width)
2. Test on tablet (768px-1024px width)
3. Test on mobile (<768px width)
4. Use browser dev tools to simulate different screen sizes

**Expected Result**:
- Desktop: Multi-column layout with sidebar filters
- Tablet: Collapsible sidebar, touch-friendly buttons
- Mobile: Single column, hamburger menu, larger touch targets
- All text remains readable at minimum sizes
- No horizontal scrolling on mobile

### Test 10: Accessibility (FR-019)
**Scenario**: User with screen reader or keyboard-only navigation

**Steps**:
1. Navigate entire app using only Tab, Enter, and Arrow keys
2. Test with screen reader (built-in macOS VoiceOver or NVDA)
3. Verify color contrast ratios meet WCAG 2.1 AA standards
4. Test with high contrast mode enabled
5. Check focus indicators are visible

**Expected Result**:
- All interactive elements are keyboard accessible
- Screen reader announces task states, counts, and actions
- Focus order is logical and visible
- Color is not the only way to convey information
- Alternative text provided for all icons and images

### Test 11: Data Persistence (FR-018)
**Scenario**: User's data persists across browser sessions

**Steps**:
1. Create several tasks with various properties
2. Close browser tab/window
3. Reopen TaskFlow in new tab
4. Verify all tasks are preserved
5. Test in private/incognito mode to verify fresh start

**Expected Result**:
- All tasks persist after browser restart
- Task properties (completion status, due dates, etc.) are preserved
- Application loads quickly with existing data
- Private browsing starts with empty task list

### Test 12: URL Routing and Deep Linking
**Scenario**: User can bookmark and share specific app states

**Steps**:
1. Apply filters on `/tasks` page: category=work, priority=high
2. Copy URL and verify it contains filter parameters
3. Open URL in new tab, verify filters are preserved
4. Navigate to specific task detail page
5. Copy task detail URL and open in new tab
6. Test back navigation preserves filter context

**Expected Result**:
- All page states are URL-addressable
- Deep links work correctly with proper error handling
- Filter states persist through URL parameters
- Navigation context is maintained across page reloads
- Invalid task IDs show proper error pages

## Performance Validation

### Load Time Test
1. Clear browser cache
2. Load TaskFlow application
3. Record time to interactive

**Target**: <3 seconds initial load (Tailwind CSS 4.0 should improve this)

### Task Operation Speed
1. Create 100+ test tasks
2. Test search performance with large dataset
3. Test filtering and sorting response time
4. Run performance tests with Vitest

**Target**: <200ms for task operations

### LocalStorage Limits
1. Create tasks until approaching 5MB limit
2. Verify graceful handling of storage quota

**Target**: Clear error messaging, data preservation

## Browser Compatibility

Test core functionality in:
- Chrome (latest)
- Firefox (latest)  
- Safari (latest)
- Edge (latest)

All acceptance scenarios should pass in each browser.

## Success Criteria

✅ All 11 test scenarios pass  
✅ No console errors during normal usage  
✅ Responsive design works across device sizes  
✅ Accessibility standards met (WCAG 2.1 AA)  
✅ Performance targets achieved  
✅ Cross-browser compatibility confirmed  

This quickstart guide validates that TaskFlow meets all functional requirements and provides an excellent user experience.