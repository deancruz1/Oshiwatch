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
      {/* Main content */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Player */}
        <div className={`flex flex-col ${isLive ? "lg:flex-1" : "w-full"}`}>
          <div className="px-6 pt-4 pb-2">
            <Link
              to={channelId ? `/talents/${channelId}` : "/"}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              ← Back
            </Link>
          </div>
          <div className="px-6 pb-6">
            {isLive ? (
              <iframe
                src={embedUrl}
                className="w-full min-h-[60vh] rounded-xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                <iframe
                  src={embedUrl}
                  className="absolute inset-0 w-full h-full rounded-xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
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
              className="w-full flex-1 min-h-[400px] lg:min-h-0 lg:h-[calc(100vh-4rem)]"
            />
          </div>
        )}
      </div>
    </div>
  );
}
