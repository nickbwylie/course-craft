import ReactPlayer from "react-player";

interface YouTubeVideoProps {
  videoId: string;
  playing?: boolean;
}

export default function YouTubeCourseVideo({
  videoId,
  playing = false,
}: YouTubeVideoProps) {
  return (
    <div className="relative w-full h-full">
      <ReactPlayer
        url={`https://www.youtube.com/watch?v=${videoId}`}
        width="100%"
        height="100%"
        controls
        playing={playing}
        config={{
          youtube: {
            playerVars: {
              modestbranding: 1,
              rel: 0,
              autoplay: 0,
            },
          },
        }}
      />
    </div>
  );
}
