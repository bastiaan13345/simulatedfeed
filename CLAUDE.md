# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a research application that simulates a TikTok/YouTube Shorts-style feed for experimental conditions. Users view one of two feed conditions (A or B) containing YouTube Shorts videos sorted by BCA (Brain Chemistry Alignment) scores. The app tracks user engagement in a controlled study environment.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production (runs TypeScript compiler first)
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Architecture

### Routes
- `/` - Landing page with condition selection buttons
- `/feed/a` - Condition A feed (loads `/public/e2w0.csv`)
- `/feed/b` - Condition B feed (loads `/public/e0w2.csv`)
- `/end` - End task screen directing users back to survey

### Core Components

**Feed.tsx** - Main feed implementation with critical features:
- **Scroll snapping**: Uses CSS `snap-y snap-mandatory` for TikTok-style vertical navigation
- **Performance optimization**: Only renders YouTube iframes within ±2 positions of active video to prevent memory/API limits
- **YouTube iframe handling**: Wrapper has `pointer-events-none`, parent div captures clicks for custom play/pause toggle
- **Autoplay/loop**: Requires `playlist` parameter set to same `videoId` for looping; relies on user interaction from landing page to satisfy browser autoplay policies

**VideoPlayer** component (inside Feed.tsx):
- Manages individual video state and player instance
- Handles play/pause based on `isActive` prop from scroll position
- Renders TikTok-style overlay UI (likes, comments, share, music icon, summary text)

### Data Flow

1. CSV files in `/feed-app/public/` are loaded via `fetch()` on component mount
2. Papaparse parses CSV into `VideoData[]` array
3. Each video renders with: status, videoId, summary, bcaScore, url
4. Filter removes empty rows and header: `row.length >= 5 && row[0] !== 'Status'`

### Key Implementation Details

**YouTube API quirks:**
- `playerVars` must include `playlist: videoId` for `loop: 1` to work
- Initial autoplay requires muted audio or prior user interaction
- Player instance accessed via `onReady` callback, stored in state for play/pause control
- Scale transform (1.05) hides YouTube branding at edges

**Performance:**
- Virtualization via conditional rendering based on `activeIndex`
- Empty placeholder `div`s maintain scroll height for off-screen videos
- `requestAnimationFrame` debounces scroll handler

**Styling:**
- Mobile-first with `100dvh` for full viewport height
- Custom `hide-scrollbar` utility in index.css
- Gradient overlays ensure text readability over video content
- `snap-center snap-always` on each video container for scroll behavior

## Data Source

`sorted_feeds.md` contains the master data table with video metadata:
- Condition A (e2w0.csv): Standard engagement feed sorted by BCA score descending
- Condition B (e0w2.csv): BCA-optimized feed with different sorting

To regenerate CSVs from the markdown table, parse the tables and extract: Status, Video ID, Summary, BCA Score, URL columns.

## Important Notes

- This is a research tool - maintain consistency in behavior between conditions
- BCA scores determine video ordering and vary between conditions
- The "Finish Task" button navigates to `/end` for survey completion
- Random engagement metrics (likes, comments) are generated client-side for realism