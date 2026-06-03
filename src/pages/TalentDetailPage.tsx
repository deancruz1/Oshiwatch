import { useParams } from 'react-router-dom'

export default function TalentDetailPage() {
  const { channelId } = useParams()
  return <div className="p-6">Talent Detail — {channelId}</div>
}
