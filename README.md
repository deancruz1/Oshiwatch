# Oshiwatch

A Hololive stream tracker built with React and TypeScript. See who's live, browse upcoming streams, explore talent pages with VOD archives, and watch directly in-app with embedded live chat — powered by the Holodex API.

## Features
- **Live & upcoming streams**: Homepage showing all currently live and scheduled Hololive streams, filterable by branch (JP/EN/ID/DEV_IS).
- **Branch filtering**: Isolate-on-first-click filter behaviour — click a branch to focus it, click others to add them back.
- **Talent roster**: Full grid of all active and graduated Hololive talents, sorted by generation with debut order for Gen 0. Filterable by branch with search.
- **Talent detail pages**: Live/upcoming stream banners, tabbed VOD archive, shorts, and music catalog with infinite pagination. YouTube and Twitter social links.
- **In-app player**: Embedded YouTube player for VODs and live streams. Live streams include an embedded live chat panel scoped to the deployed domain.
- **Secure API proxy**: All Holodex API calls route through Vercel serverless functions — the API key is never exposed to the client bundle.

## Technologies Used
- **React 19**: Component-based UI with hooks
- **TypeScript**: Type-safe development across all components and API layers
- **Tailwind CSS v4**: Utility-first styling via the Vite plugin
- **TanStack Query**: Data fetching, caching, background polling, and infinite pagination
- **React Router v7**: Client-side routing
- **shadcn/ui**: UI primitives (tabs, badges, skeleton loaders)
- **Holodex API v2**: Live streams, upcoming schedules, talent metadata, VOD archives, and music
- **Vercel Serverless Functions**: API proxy layer keeping the Holodex key server-side
- **Vite**: Build tool and dev server

## Project Structure

### API Proxy (`api/`)
Vercel serverless functions that forward requests to Holodex with the API key attached server-side. Never imported by the client.
```
api/
├── _types.ts           # Minimal VercelRequest/VercelResponse types
├── channels.ts         # GET /channels proxy
├── channels/[id].ts    # GET /channels/:id proxy
├── live.ts             # GET /live proxy
└── videos.ts           # GET /videos proxy
```

### Source Structure
```
src/
├── api/
│   └── holodex.ts          # Client-side fetch functions (calls /api/* proxy endpoints)
├── assets/
│   └── talent-images/      # Local fallback images for talents with missing API photos
├── components/
│   ├── layout/
│   │   ├── Layout.tsx       # App shell with navbar and footer
│   │   └── Navbar.tsx       # Sticky frosted-glass navbar with active link indicators
│   ├── stream/
│   │   ├── BranchFilter.tsx # JP/EN/ID/DEV_IS filter with isolate-on-click behaviour
│   │   ├── StreamCard.tsx   # Live/upcoming stream card with viewer count and status badge
│   │   └── StreamGrid.tsx   # Responsive grid with skeleton loading state
│   └── talent/
│       ├── LiveBanner.tsx   # Live/upcoming banner for talent detail pages
│       ├── TalentCard.tsx   # Talent grid card with live indicator and gen badge
│       └── VideoCard.tsx    # VOD/shorts/music card with duration and date
├── hooks/
│   ├── useFavourites.ts     # localStorage-based favourites (built, not yet surfaced in UI)
│   └── useHolodex.ts        # TanStack Query hooks for all Holodex data
├── lib/
│   ├── branch.ts            # Branch detection, filtering, and gen-sort logic
│   └── talent.ts            # Shared gen label and accent colour helpers
├── pages/
│   ├── HomePage.tsx         # Live now + upcoming streams with branch filter
│   ├── TalentDetailPage.tsx # Talent page with banners, tabs, and infinite pagination
│   ├── TalentsPage.tsx      # Full roster grid with branch filter and search
│   └── WatchPage.tsx        # Embedded YouTube player with live chat
└── types/
    └── holodex.ts           # TypeScript interfaces for all Holodex API shapes
```

### Key Components
- **BranchFilter:** First click isolates the selected branch; subsequent clicks add/remove. Clicking the last active branch resets to all.
- **StreamCard:** Displays thumbnail, live badge with animated pulse, viewer count, channel avatar, and scheduled countdown for upcoming streams.
- **TalentCard:** Avatar with live indicator dot, gen badge with branch accent colour, subscriber count, and graduated tag for inactive talents.
- **LiveBanner:** Prominent card above tabs on talent detail pages. Red gradient for live streams, muted for upcoming. Shows viewer count or countdown and links to the watch page.
- **VideoCard:** Thumbnail with duration overlay, title, and publish date. Links to the in-app watch page.
- **WatchPage:** Full-screen embedded YouTube player. Live streams render with a 380px live chat sidebar on desktop, stacked below on mobile.

### Data Flow
- **API Proxy:** The browser calls `/api/live`, `/api/channels`, `/api/videos`. Vercel routes these to serverless functions that attach the `X-APIKEY` header and forward to Holodex. The key never touches the client.
- **Caching & Polling:** TanStack Query caches all responses. Live data refetches every 5 minutes automatically. Channel data is stale after 10 minutes.
- **Filtering:** Branch detection runs client-side against the `group` field (channels endpoint) and `suborg`/`name` fields (live endpoint) since the two endpoints return different schemas for the same data.
- **Pagination:** VOD archives, shorts, and music use `useInfiniteQuery` with `offset`-based pagination, fetching 50 results per page on demand.

## Environment Variables

Create a `.env` file in the project root:

```
HOLODEX_API_KEY=your_key_here
```

Get your API key from Account Settings on [holodex.net](https://holodex.net).

Add the same variable to your Vercel project under **Settings → Environment Variables**.

## Deployment

This project is deployed on Vercel. The `api/` folder is automatically detected as serverless functions.

Connect your GitHub repo to Vercel, add the `HOLODEX_API_KEY` environment variable, and deploy. No additional configuration required.

Live at: [https://oshiwatch.vercel.app](https://oshiwatch.vercel.app)

## Usage
- **Live**: See all currently live Hololive streams with viewer counts. Filter by branch.
- **Upcoming**: Streams scheduled in the next 48 hours with countdown timers.
- **Talents**: Browse the full roster sorted by generation. Search by name or filter by branch. Click any talent to open their detail page.
- **Talent Detail**: See if they're live or have a stream coming up. Browse their archived streams, shorts, and music with load-more pagination.
- **Watch**: Click any stream or video to open the in-app player. Live streams show embedded live chat alongside the player.

## Attribution
Stream data powered by [Holodex](https://holodex.net). Oshiwatch is not affiliated with Cover Corp.

## Contact
- **Email**: deancruzgg@gmail.com
- **GitHub**: https://github.com/deancruz1
- **LinkedIn**: https://www.linkedin.com/in/dean-cruz/
