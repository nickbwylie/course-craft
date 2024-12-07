"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  parseYouTubeDuration,
  YoutubeVideoPreview,
} from "@/helperFunctions/youtubeVideo";

const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@yahoo.com",
  },
];

// https://www.youtube.com/watch?v=yLFt0hdBMaI

const youtubeVideoPreviews: YoutubeVideoPreview[] = [
  {
    channel: "Lex Clips",
    title: "How to start a successful business | Mark Cuban and Lex Fridman",
    videoId: "yLFt0hdBMaI",
    duration: "PT5M56S",
    thumbnail: "https://i.ytimg.com/vi/AH1FN_y8IP8/maxresdefault.jpg",
  },
];

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<YoutubeVideoPreview>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "thumbnail",
    header: () => <div className="text-right">Thumbnail</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">
          <img src={row.getValue("thumbnail")} width={100} />
        </div>
      );
    },
  },
  {
    accessorKey: "channel",
    header: "Channel",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("channel")}</div>
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return <div className="capitalize">Title</div>;
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "duration",
    header: () => <div className="text-right">Duration</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right font-medium">
          {parseYouTubeDuration(row.getValue("duration"))}
        </div>
      );
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      // const videoInfo = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
            // onClick={() => navigator.clipboard.writeText(videoInfo.videoId)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

interface YoutubeDataTableProps {
  courseVideos: YoutubeVideoPreview[];
  youtubeVideoUrl: string;
  setYoutubeVideoUrl: React.Dispatch<React.SetStateAction<string>>;
  addYoutubeVideo: () => void;
}

export default function YoutubeDataTable({
  courseVideos,
  youtubeVideoUrl,
  setYoutubeVideoUrl,
  addYoutubeVideo,
}: YoutubeDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    columns,
    data: courseVideos,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-2">
        <HoverCard>
          <HoverCardTrigger className="w-100" asChild>
            <div className="flex w-full  items-center space-x-2">
              <Input
                placeholder="Add YouTube video url"
                value={youtubeVideoUrl}
                onChange={(e) => setYoutubeVideoUrl(e.target.value)}
                className="w-full"
              />
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  addYoutubeVideo();
                }}
              >
                Add
              </Button>
            </div>
          </HoverCardTrigger>
          <HoverCardContent>
            1. Find the YouTube video to add.
            <br />
            2. Copy and paste the url into the above field.
            <br />
            3. Click add to add the video to the course.
          </HoverCardContent>
        </HoverCard>
      </div>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
