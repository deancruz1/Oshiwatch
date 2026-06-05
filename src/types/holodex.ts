export type VideoStatus = "new" | "upcoming" | "live" | "past" | "missing";
export type VideoType = "stream" | "clip";

export interface Channel {
  id: string;
  name: string;
  english_name: string | null;
  type: "vtuber" | "subber";
  photo: string;
  banner?: string;
  org?: string;
  suborg?: string;
  group?: string;
  subscriber_count?: number;
  video_count?: number;
  description?: string;
  inactive?: boolean;
  twitter?: string;
}

export interface Video {
  id: string;
  title: string;
  type: VideoType;
  status: VideoStatus;
  available_at: string;
  published_at?: string;
  start_scheduled?: string;
  start_actual?: string;
  end_actual?: string;
  duration: number;
  live_viewers?: number;
  channel: Channel;
  topic_id?: string;
  description?: string;
}

export interface LiveVideosParams {
  org?: string;
  status?: VideoStatus | string;
  type?: VideoType;
  include?: string;
  limit?: number;
  offset?: number;
  channel_id?: string;
}

export interface VideosParams {
  channel_id?: string;
  type?: VideoType;
  status?: VideoStatus | string;
  topic?: string;
  include?: string;
  limit?: number;
  offset?: number;
  org?: string;
}

export interface ChannelsParams {
  org?: string;
  limit?: number;
  offset?: number;
  type?: string;
}
