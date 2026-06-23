# Plan: LegalLens_ZenAI Dark-Mode UI

## Context
Building a complete dark-mode web application wireframe for LegalLens_ZenAI — an AI-powered legal document analysis tool. The user wants a production-quality UI with glassmorphism styling, gradient accents, and micro-animations across five major feature areas: dashboard, document upload, search/filter, AI chat, and settings. The project has an empty App.tsx ready to fill.

## Design Decisions

### Visual Style
- **Dark mode forced** by adding `dark` class to `<html>` via `next-themes` ThemeProvider
- **Glassmorphism**: `bg-white/5 backdrop-blur-xl border border-white/10` pattern throughout
- **Gradient accents**: `from-violet-500 via-purple-500 to-indigo-600` for CTAs, `from-cyan-400 to-blue-500` for secondary
- **Inter font** imported in `src/styles/fonts.css` via Google Fonts
- **Motion animations**: entrance animations (fade+slide), loading spinners, hover transitions

### Architecture
- Single-page app with tab-based navigation (no router needed — tabs are sufficient for a wireframe)
- Left sidebar navigation with icons + labels, collapsible on tablet
- Main content area switches between 5 views
- Settings as a Dialog overlay (available from any view)

## Files to Create/Modify

### 1. `src/styles/fonts.css`
Add Google Fonts import for Inter (400, 600 weights).

### 2. `src/styles/theme.css`
Override CSS variables to establish deeper dark palette:
- `--background`: `oklch(0.08 0 0)` (near black)
- `--card`: `oklch(0.12 0.005 264)` (dark blue-tinted)
- Custom gradient accent tokens

### 3. `src/app/App.tsx`
Main layout: ThemeProvider wrapping entire app in dark mode, left nav sidebar, content area with active view state, Settings dialog trigger.

### 4. `src/app/components/NavSidebar.tsx`
Left sidebar with:
- LegalLens logo/wordmark (gradient text)
- Nav items: Dashboard, Documents, Search, AI Chat
- Settings trigger at bottom
- Active state highlight with gradient background
- Collapsible on tablet (`md:w-16` icon-only mode)

### 5. `src/app/components/Dashboard.tsx`
Home view with:
- Header with greeting + date
- 3 summary cards: Documents Processed, AI Confidence Score, Recent Activity (using shadcn Card)
- Mini bar chart (recharts) for processing history
- Recent documents table (shadcn Table)
- All cards use glassmorphism styling + entrance animations

### 6. `src/app/components/DocumentUpload.tsx`
Upload panel with:
- Drag-and-drop zone (react-dnd or native HTML5 drag events)
- File picker button
- Supported formats badge list
- OCR settings accordion (language, confidence threshold, region detection toggles)
- Upload progress simulation (shadcn Progress)
- Uploaded files list with status badges

### 7. `src/app/components/SearchSidebar.tsx`
Two-panel layout:
- Left: filter sidebar (tags multi-select, date range picker via react-day-picker, AI-suggested keywords as badge chips, confidence slider)
- Right: search results list with document cards showing snippet highlights and relevance scores

### 8. `src/app/components/AIChatInterface.tsx`
Chat panel with:
- Conversation pane (scrollable, alternating user/AI message bubbles)
- AI response loading animation (3-dot pulse using Motion)
- Prompt textarea + send button
- Context document chips (attached legal docs)
- Model indicator badge in header

### 9. `src/app/components/SettingsModal.tsx`
Dialog with tabbed sections:
- API Keys tab (masked inputs with reveal toggle, test connection button)
- Model Selection tab (radio cards for GPT-4/Claude/etc.)
- Privacy tab (toggle switches for data retention, telemetry)

### 10. `src/app/components/ui-kit/ComponentShowcase.tsx` (optional embedded library preview)
Not a separate route — components are the building blocks used throughout the above.

## Component Library Patterns (reused throughout)
Using existing shadcn/ui components from `src/app/components/ui/`:
- `Button` with custom glassmorphism + gradient variants via `className` prop
- `Card` / `CardHeader` / `CardContent` with glass effect
- `Badge` for tags, statuses, formats
- `Dialog` for Settings modal
- `Tabs` for Settings sections
- `Switch` for toggles
- `Slider` for confidence threshold
- `Progress` for upload progress
- `Avatar` for user profile
- `Tooltip` for icon-only nav on tablet

## Key Tailwind Patterns
```tsx
// Glass card
"bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl"

// Gradient accent button  
"bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700"

// Gradient text
"bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"

// Subtle glow
"shadow-[0_0_30px_rgba(139,92,246,0.15)]"
```

## Motion Animation Patterns
```tsx
// Entrance
initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}

// Stagger children
transition={{ delay: index * 0.1 }}

// Loading dots
animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
```

## Verification
1. App renders in dark mode with glassmorphism cards visible
2. All 5 navigation tabs switch content correctly
3. Document upload drag-drop zone shows hover state and file list
4. Chat interface shows message bubbles and loading animation
5. Settings modal opens/closes with tabbed content
6. Responsive: sidebar collapses to icons at `md` breakpoint, layout adjusts at `lg`
