import type { Video } from '@/types/holodex'
import StreamCard from './StreamCard'
import { Skeleton } from '@/components/ui/skeleton'

interface StreamGridProps {
  videos: Video[]
  loading: boolean
  emptyMessage: string
}

export default function StreamGrid({ videos, loading, emptyMessage }: StreamGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-xl overflow-hidden bg-white/5 border border-white/10">
            <Skeleton className="aspect-video w-full" />
            <div className="p-3 flex gap-3">
              <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500 text-sm">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {videos.map(video => (
        <StreamCard key={video.id} video={video} />
      ))}
    </div>
  )
}
