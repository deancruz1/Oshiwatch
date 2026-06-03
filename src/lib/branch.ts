import type { Branch } from '@/components/stream/BranchFilter'
import type { Video } from '@/types/holodex'

export function getVideoBranch(video: Video): Branch | null {
  const group = (video.channel.group ?? '').toLowerCase()
  const name = (video.channel.name ?? '').toLowerCase()

  if (group.includes('english') || name.includes('hololive-en')) return 'EN'
  if (group.includes('indonesia') || name.includes('hololive-id')) return 'ID'
  if (group.includes('dev_is') || group.includes('devis') || name.includes('dev_is')) return 'DEV_IS'
  // default anything else JP (Holostars JP included)
  return 'JP'
}

export function filterVideosByBranch(videos: Video[], selected: Branch[]): Video[] {
  return videos.filter(v => {
    const branch = getVideoBranch(v)
    return branch && selected.includes(branch)
  })
}
