# Problem Details Drawer UI Spec

## Overview

Build a right-side problem details drawer UI similar to the provided screenshots below in reference.  
This drawer is part of the dashboard experience and displays coding problem metadata, patterns, actions, and navigation.

The UI should closely follow the visual structure and spacing from the reference screenshots.

---

## Requirements

### Drawer Layout

- Right-side fixed drawer
- Full height layout
- Dark theme by default
- Scrollable content area
- Smooth open/close transition
- Close button at top-right
- Drawer width around default 30-40% of screen(width adjustable)

---

## Header Section

### Title Area

Include:

- Problem title
- External link icon beside title
- Problem ID below title

Example:

```txt
Two Sum
Problem ID: #1

## References

- @context/screenshots/dashboard-ui-drawer1.png
- @context/screenshots/dashboard-ui-drawer2.png
- @context/project-overview.md
- @src/lib/mock-data.ts
- @context/features/dashboard-drawer.md
- @context/features/dashboard-phase-2-spec.md
- @context/features/dashboard-phase-3-spec.md