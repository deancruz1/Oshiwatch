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
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Player */}
        <div className={`flex flex-col p-4 ${isLive ? "lg:flex-1" : "w-full"}`}>
          <div
            className="relative w-full h-full"
            style={{ paddingTop: isLive ? undefined : "56.25%" }}
          >
            {isLive ? (
              <iframe
                src={embedUrl}
                className="w-full h-full min-h-[60vh] rounded-xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <iframe
                src={embedUrl}
                className="absolute inset-0 w-full h-full rounded-xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>

        {/* Live chat */}
        {isLive && (
          <div className="flex flex-col w-full lg:w-[380px] flex-shrink-0 border-t lg:border-t-0 lg:border-l border-white/10">
            <div className="px-4 py-2 border-b border-white/10 flex-shrink-0">
              <p className="text-xs text-gray-400 font-medium">Live Chat</p>
            </div>
            <iframe
              src={chatUrl}
              className="w-full flex-1 min-h-[400px] lg:min-h-0 lg:h-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
