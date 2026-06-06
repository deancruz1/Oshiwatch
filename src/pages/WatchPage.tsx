import { useParams, useSearchParams, Link } from "react-router-dom";

export default function WatchPage() {
  const { videoId } = useParams<{ videoId: string }>();
  const [searchParams] = useSearchParams();
  const channelId = searchParams.get("from");
  const isLive = searchParams.get("live") === "true";

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  const chatUrl = `https://www.youtube.com/live_chat?v=${videoId}&embed_domain=oshiwatch.vercel.app`;

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white">
      {/* Navbar */}
      <header className="flex-shrink-0 h-12 border-b border-white/10 bg-gray-950/80 backdrop-blur-md flex items-center justify-between px-6">
        <Link
          to="/"
          className="font-bold text-base tracking-tight hover:opacity-80 transition-opacity"
        >
          Oshiwatch
        </Link>
        <Link
          to={channelId ? `/talents/${channelId}` : "/"}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          ← Back
        </Link>
      </header>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* Player */}
        <div
          className={`flex flex-col flex-1 overflow-hidden ${isLive ? "" : "justify-center"}`}
        >
          {isLive ? (
            <iframe
              src={embedUrl}
              className="w-full flex-1"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <div className="relative w-full h-full">
                <iframe
                  src={embedUrl}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>

        {/* Live chat */}
        {isLive && (
          <div className="flex flex-col w-full lg:w-[380px] flex-shrink-0 border-l border-white/10">
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
