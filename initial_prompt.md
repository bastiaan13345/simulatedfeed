# Initial Project Prompt

*Note: This is a reconstructed prompt based on the initial requirements of the project.*

**Goal:** Build a mobile-first, TikTok/Shorts-style feed UI that natively plays YouTube Shorts.

**Requirements:**
1.  **Framework:** Use React (with Vite), TypeScript, and Tailwind CSS.
2.  **Data Source:** Read data from a provided markdown file (`sorted_feeds.md`), which contains tables for "Condition A" and "Condition B". Extract this data into two separate CSV files (`e2w0.csv` for A, `e0w2.csv` for B).
3.  **Routing:** Implement a router with the following pages:
    *   **Landing Page (`/`):** Simple buttons to route users to either Condition A or Condition B feeds.
    *   **Feed Page (`/feed/:condition`):** 
        *   Display a full-screen, scrollable, vertically-snapping feed of YouTube shorts.
        *   Use `react-youtube` for the video embeds (autoplay, loop, no controls).
        *   Overlay TikTok-style UI elements (likes, comments, share, username, summary text).
        *   Load the appropriate CSV data based on the route condition.
    *   **End Task Page (`/end`):** A simple finish screen instructing the user to return to their survey.
4.  **Styling:** Ensure a mobile-first design. Hide scrollbars but keep functionality. Add polished animations (like a spinning music record icon).