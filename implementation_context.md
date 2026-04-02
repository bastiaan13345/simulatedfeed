# AI Implementation Context

This document provides context for other AI agents working on the `feed-app` project.

## Tech Stack
*   **Core:** React 18, Vite, TypeScript
*   **Routing:** `react-router-dom`
*   **Styling:** Tailwind CSS (with custom hide-scrollbar utilities in `index.css`)
*   **Video Player:** `react-youtube` (YouTube IFrame API wrapper)
*   **Data Parsing:** `papaparse` (for reading local CSV files)
*   **Icons:** `lucide-react`

## Project Structure
*   `/feed-app/public/`: Contains the parsed data files `e2w0.csv` (Condition A) and `e0w2.csv` (Condition B).
*   `/feed-app/src/App.tsx`: Sets up the `BrowserRouter` and routes (`/`, `/feed/a`, `/feed/b`, `/end`).
*   `/feed-app/src/Landing.tsx`: Simple entry point with navigation buttons.
*   `/feed-app/src/Feed.tsx`: The core logic for the infinite scroll video feed.
*   `/feed-app/src/EndTask.tsx`: Simple exit page.

## Key Implementation Details & Gotchas

### 1. YouTube Iframe & Overlay Events
*   **Issue:** The YouTube iframe captures all touch/click events, preventing custom play/pause interactions and interfering with scroll in some contexts.
*   **Solution:** The `<YouTube>` component wrapper has `pointer-events-none` so it ignores clicks. A parent container captures the `onClick` event to toggle play/pause via the YouTube Player API (`player.playVideo()` and `player.pauseVideo()`).

### 2. Scroll Snapping & Performance
*   **Implementation:** The feed container uses Tailwind classes `overflow-y-scroll snap-y snap-mandatory flex flex-col h-[100dvh]`. Each video item uses `h-[100dvh] w-full shrink-0 snap-center snap-always`.
*   **Virtualization/Optimization:** Rendering many YouTube iframes causes massive performance issues and API rate limits. 
    *   The `handleScroll` function calculates the `activeIndex` based on `scrollTop`.
    *   Only videos within a narrow window (e.g., `Math.abs(index - activeIndex) <= 2`) actually render the `<YouTube>` component.
    *   Videos outside this window render a black placeholder `div` to maintain the scroll height and layout.

### 3. Autoplay Policies
*   **Handling:** YouTube's autoplay policy requires videos to be muted initially on many browsers, but we configured it with `mute: 0` and `autoplay: 1` in `playerVars`. It relies on the user interacting with the page (e.g., clicking on the Landing page) to satisfy browser interaction requirements before the feed loads.
*   **Looping:** For a YouTube Short to loop properly via the API, the `playlist` parameter must be set to the same `videoId`.

### 4. Data Loading
*   CSV files are loaded asynchronously on component mount in `Feed.tsx` using `fetch()` and then parsed with `Papa.parse`.
*   A filter `row.length >= 5 && row[0] !== 'Status'` is applied to ignore empty lines and the header row from the parsed arrays.