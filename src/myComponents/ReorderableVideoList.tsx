import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Trash, GripVertical } from "lucide-react";
import {
  YoutubeVideoPreview,
  parseYouTubeDuration,
} from "@/helperFunctions/youtubeVideo";
import { motion, Reorder } from "framer-motion";

// Component for each draggable video item
const DraggableVideoItem = ({
  video,
  onDelete,
}: {
  video: YoutubeVideoPreview;
  index: number;
  onDelete: (videoId: string) => void;
}) => {
  return (
    <Reorder.Item
      key={video.videoId}
      value={video.videoId}
      className={`flex p-3 items-center mb-2 border rounded-md bg-gray-50 dark:bg-gray-900 `}
    >
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="rounded-md flex gap-3 w-full items-center
                              bg-gray-50 dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow cursor-move"
        whileDrag={{
          scale: 1.03,
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          background: "#e6f7ff",
        }}
      >
        {/* <div className="p-1 rounded cursor-grab">
          <GripVertical className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div> */}

        <div className="w-24 h-16 relative flex-shrink-0 rounded overflow-hidden">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
            draggable={false}
            style={{ userSelect: "none" }}
          />
          <div className="absolute bottom-0 right-0 bg-black/75 text-white text-xs px-1 py-0.5 rounded-tl-sm">
            {parseYouTubeDuration(video.duration)}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
            {video.title}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {video.channel}
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(video.videoId);
          }}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </motion.div>
    </Reorder.Item>
  );
};

// Main component
interface ReorderableListProps {
  videos: YoutubeVideoPreview[];
  onReorder: (videos: string[]) => void;
  onDelete: (videoId: string) => void;
}

export default function ReorderableVideoList({
  videos,
  onReorder,
  onDelete,
}: ReorderableListProps) {
  // Function to handle reordering

  const handleDelete = useCallback(
    (videoId: string) => {
      onDelete(videoId);
    },
    [onDelete]
  );

  const videoIds = videos.map((video) => video.videoId);

  return (
    <div className="w-full rounded-lg bg-white dark:bg-gray-800 p-1">
      {videos.length === 0 ? (
        <div className="text-center p-4 text-gray-500 dark:text-gray-400 text-sm">
          No videos added yet. Add videos using the form above.
        </div>
      ) : (
        <Reorder.Group
          axis="y"
          values={videoIds}
          onReorder={onReorder}
          className="space-y-2"
        >
          {videos.map((video, index) => (
            <DraggableVideoItem
              key={video.videoId}
              video={video}
              index={index}
              onDelete={handleDelete}
            />
          ))}
        </Reorder.Group>
      )}
    </div>
  );
}
