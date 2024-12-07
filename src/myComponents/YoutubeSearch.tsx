import React, { useState } from "react";
import axios from "axios";

const YOUTUBE_API_KEY = "AIzaSyAcmeobcQt2c7x71xyTVtzGw7O4ciyYLpY";

interface Video {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    channelId: string;
    thumbnails: {
      default: {
        url: string;
      };
    };
  };
}

const YoutubeSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [videos, setVideos] = useState<Video[]>([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            part: "snippet",
            maxResults: 10,
            q: searchTerm,
            key: YOUTUBE_API_KEY,
            type: "video",
          },
        }
      );
      console.log("yotube video data", response.data.items);

      setVideos(response.data.items);
    } catch (error) {
      console.error("Error fetching YouTube videos:", error);
    }
  };

  //   const addVideoToDatabase = async (videoId: string, title: string) => {
  //     try {
  //       const response = await axios.post("https://your-backend-api.com/videos", {
  //         videoId,
  //         title,
  //         videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
  //       });

  //       if (response.status === 201) {
  //         alert("Video added successfully!");
  //       }
  //     } catch (error) {
  //       console.error("Error adding video:", error);
  //       alert("Failed to add video.");
  //     }
  //   };

  return (
    <div>
      <h2>YouTube Video Search</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search YouTube videos"
        className="p-2"
      />
      <button onClick={handleSearch}>Search</button>

      <div>
        {videos.map((video) => (
          <div key={video.id.videoId} className="w-full bg-gray-100 mb-2">
            <h3>{video.snippet.title}</h3>
            <img
              src={video.snippet.thumbnails.default.url}
              alt={video.snippet.title}
            />
            <p>{video.snippet.description}</p>
            <a
              href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch on YouTube
            </a>
            <button onClick={() => console.log("add video to db")}>
              Add Video
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YoutubeSearch;
