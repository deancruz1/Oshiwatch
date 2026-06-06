import { useParams, useSearchParams, Link } from "react-router-dom";

export default function WatchPage() {
  const { videoId } = useParams<{ videoId: string }>();
  const [searchParams] = useSearchParams();
  const channelId = searchParams.get("from");
  const isLive = searchParams.get("live") === "true";

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  const chatUrl = `https://www.youtube.com/live_chat?v=${videoId}&embed_domain=oshiwatch.vercel.app`;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-gray-950">
      {/* Back nav */}
      <div className="px-4 py-2 border-b border-white/10 flex items-center gap-3 flex-shrink-0">
        <Link
          to={channelId ? `/talents/${channelId}` : "/"}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          ← Back
        </Link>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        {/* Player side */}
        <div className="flex-1 flex flex-col justify-start p-4">
          <div className="w-full max-w-4xl mx-auto">
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <iframe
                src={embedUrl}
                className="absolute inset-0 w-full h-full rounded-xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* Live chat */}
        {isLive && (
          <div className="flex flex-col w-full lg:w-[360px] flex-shrink-0 border-t lg:border-t-0 lg:border-l border-white/10 h-[400px] lg:h-auto">
            <div className="px-4 py-2 border-b border-white/10 flex-shrink-0">
              <p className="text-xs text-gray-400 font-medium">Live Chat</p>
            </div>
            <iframe src={chatUrl} className="flex-1 w-full" />
          </div>
        )}
      </div>
    </div>
  );
}
