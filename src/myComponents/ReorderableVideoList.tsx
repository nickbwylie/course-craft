import React, { useRef, useCallback } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "@/components/ui/button";
import { Trash, GripVertical } from "lucide-react";
import {
  YoutubeVideoPreview,
  parseYouTubeDuration,
} from "@/helperFunctions/youtubeVideo";

// Define the item type
const ItemTypes = {
  VIDEO: "video",
};

// Define the drag item interface
interface DragItem {
  index: number;
  id: string;
  type: string;
}

// Component for each draggable video item
const DraggableVideoItem = ({
  video,
  index,
  moveVideo,
  onDelete,
}: {
  video: YoutubeVideoPreview;
  index: number;
  moveVideo: (dragIndex: number, hoverIndex: number) => void;
  onDelete: (videoId: string) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // Set up the drop functionality
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.VIDEO,
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the item's height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveVideo(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  // Set up the drag functionality
  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.VIDEO,
    item: () => ({ id: video.videoId, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Only apply drag to the handle, but preview the entire component
  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`flex items-center gap-3 mb-2 border ${
        isOver
          ? "border-cyan-500 dark:border-cyan-400"
          : "border-gray-200 dark:border-gray-700"
      } rounded-md p-3 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
        isDragging ? "opacity-50" : ""
      }`}
      style={{ touchAction: "none" }}
    >
      <div className="p-1 rounded cursor-grab">
        <GripVertical className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </div>

      <div className="w-16 h-10 relative flex-shrink-0 rounded overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
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
    </div>
  );
};

// Main component
interface ReorderableListProps {
  videos: YoutubeVideoPreview[];
  onReorder: (videos: YoutubeVideoPreview[]) => void;
  onDelete: (videoId: string) => void;
}

function ReorderableList({
  videos,
  onReorder,
  onDelete,
}: ReorderableListProps) {
  // Function to handle reordering
  const moveVideo = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const newVideos = [...videos];
      const draggedVideo = newVideos[dragIndex];

      // Remove the dragged item
      newVideos.splice(dragIndex, 1);
      // Insert it at the new position
      newVideos.splice(hoverIndex, 0, draggedVideo);

      onReorder(newVideos);
    },
    [videos, onReorder]
  );

  const handleDelete = useCallback(
    (videoId: string) => {
      onDelete(videoId);
    },
    [onDelete]
  );

  return (
    <div className="w-full rounded-lg bg-white dark:bg-gray-800 p-1">
      {videos.length === 0 ? (
        <div className="text-center p-4 text-gray-500 dark:text-gray-400 text-sm">
          No videos added yet. Add videos using the form above.
        </div>
      ) : (
        videos.map((video, index) => (
          <DraggableVideoItem
            key={video.videoId}
            video={video}
            index={index}
            moveVideo={moveVideo}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}

// Wrap the component with DndProvider when exporting
export default function ReorderableVideoList(props: ReorderableListProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <ReorderableList {...props} />
    </DndProvider>
  );
}
