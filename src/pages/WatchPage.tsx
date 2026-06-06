import { useParams, useSearchParams, Link } from "react-router-dom";
import { useVideos } from "@/hooks/useHolodex";

export default function WatchPage() {
  const { videoId } = useParams<{ videoId: string }>();
  const [searchParams] = useSearchParams();
  const channelId = searchParams.get("from");
  const isLive = searchParams.get("live") === "true";

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  const chatUrl = `https://www.youtube.com/live_chat?v=${videoId}&embed_domain=oshiwatch.vercel.app`;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
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
      <div className="flex flex-1 overflow-hidden">
        {/* Player */}
        <div
          className={`flex flex-col flex-1 ${isLive ? "lg:w-[calc(100%-380px)]" : "w-full"}`}
        >
          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Live chat — only for live streams */}
        {isLive && (
          <div className="hidden lg:flex flex-col w-[380px] flex-shrink-0 border-l border-white/10">
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
