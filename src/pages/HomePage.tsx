import { useState } from 'react'
import { useLiveVideos } from '@/hooks/useHolodex'
import BranchFilter, { type Branch } from '@/components/stream/BranchFilter'
import StreamGrid from '@/components/stream/StreamGrid'
import { filterVideosByBranch } from '@/lib/branch'
import type { Video } from '@/types/holodex'

export default function HomePage() {
  const [selectedBranches, setSelectedBranches] = useState<Branch[]>(['EN', 'JP', 'ID', 'DEV_IS'])

  const { data: videos = [], isLoading, error } = useLiveVideos({
    org: 'Hololive',
    include: 'live_info',
  })

  const filtered = filterVideosByBranch(videos as Video[], selectedBranches)
  const liveVideos = filtered.filter((v: Video) => v.status === 'live')
  const upcomingVideos = filtered.filter((v: Video) => v.status === 'upcoming')

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-8 space-y-10">

      {/* Header + filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Now &amp; Next</h1>
          <p className="text-sm text-gray-400 mt-0.5">Hololive streams — live and coming up</p>
        </div>
        <BranchFilter selected={selectedBranches} onChange={setSelectedBranches} />
      </div>

      {error && (
        <div className="rounded-lg bg-red-950/50 border border-red-800 text-red-300 text-sm px-4 py-3">
          Failed to load streams. Check your API key or try again later.
        </div>
      )}

      {/* Live now */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <h2 className="text-lg font-semibold">Live Now</h2>
          {!isLoading && (
            <span className="text-xs text-gray-500 ml-1">{liveVideos.length} stream{liveVideos.length !== 1 ? 's' : ''}</span>
          )}
        </div>
        <StreamGrid
          videos={liveVideos}
          loading={isLoading}
          emptyMessage="No one is live right now."
        />
      </section>

      {/* Upcoming */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-gray-500" />
          <h2 className="text-lg font-semibold">Upcoming</h2>
          {!isLoading && (
            <span className="text-xs text-gray-500 ml-1">{upcomingVideos.length} scheduled</span>
          )}
        </div>
        <StreamGrid
          videos={upcomingVideos}
          loading={isLoading}
          emptyMessage="No streams scheduled in the next 48 hours."
        />
      </section>

    </div>
  )
}
