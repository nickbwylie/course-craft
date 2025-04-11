import { useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Trash, GripVertical } from "lucide-react";
import {
  YoutubeVideoPreview,
  parseYouTubeDuration,
} from "@/helperFunctions/youtubeVideo";
import { motion, Reorder, useDragControls } from "framer-motion";

// Component for each draggable video item
const DraggableVideoItem = ({
  video,
  index,
  onDelete,
}: {
  video: YoutubeVideoPreview;
  index: number;
  onDelete: (videoId: string) => void;
}) => {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={video}
      id={video.videoId}
      className="list-none w-full"
      dragControls={dragControls}
      dragListener={false} // Disable automatic drag detection
    >
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="flex p-3 items-center mb-2 border rounded-md bg-gray-50 dark:bg-gray-900 shadow-sm hover:shadow-md w-full"
        whileTap={{ scale: 0.98 }}
      >
        <div
          className="p-1 rounded cursor-grab touch-none flex-shrink-0 mr-1"
          onPointerDown={(e) => {
            e.preventDefault();
            dragControls.start(e);
          }}
        >
          <GripVertical className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>

        <div className="w-20 h-14 relative flex-shrink-0 rounded overflow-hidden">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute bottom-0 right-0 bg-black/75 text-white text-xs px-1 py-0.5 rounded-tl-sm">
            {parseYouTubeDuration(video.duration)}
          </div>
        </div>

        <div className="flex-1 min-w-0 mx-2">
          <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-1">
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
  // Use the videos array directly for reordering
  const [reorderedVideos, setReorderedVideos] =
    useState<YoutubeVideoPreview[]>(videos);

  // Update internal state when props change
  useEffect(() => {
    setReorderedVideos(videos);
  }, [videos]);

  // Function to handle reordering
  const handleReorder = useCallback(
    (newOrder: YoutubeVideoPreview[]) => {
      setReorderedVideos(newOrder);
      // Extract video IDs to pass to parent component
      const videoIds = newOrder.map((video) => video.videoId);
      onReorder(videoIds);
    },
    [onReorder]
  );

  // Function to handle deletion
  const handleDelete = useCallback(
    (videoId: string) => {
      onDelete(videoId);
    },
    [onDelete]
  );

  return (
    <div className="w-full rounded-lg bg-white dark:bg-gray-800">
      {videos.length === 0 ? (
        <div className="text-center p-6 text-gray-500 dark:text-gray-400 text-sm border border-dashed border-gray-300 dark:border-gray-700 rounded-md">
          No videos added yet. Add videos using the form above.
        </div>
      ) : (
        <div className="mb-2 text-xs text-gray-500 dark:text-gray-400 px-2">
          <span className="flex items-center">
            <GripVertical className="h-4 w-4 mr-1" />
            Drag videos to reorder them
          </span>
        </div>
      )}

      <Reorder.Group
        axis="y"
        values={reorderedVideos}
        onReorder={handleReorder}
        className="space-y-2 w-full"
      >
        {reorderedVideos.map((video, index) => (
          <DraggableVideoItem
            key={video.videoId}
            video={video}
            index={index}
            onDelete={handleDelete}
          />
        ))}
      </Reorder.Group>
    </div>
  );
}
