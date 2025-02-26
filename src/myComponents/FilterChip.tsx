import React, { useState } from "react";
// Import shadcn/ui components (adjust paths as needed)
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FilterOption {
  value: string;
  label: string;
}

// Define available filter options
const options: FilterOption[] = [
  { value: "CourseCraft", label: "Site generated" },
  { value: "banana", label: "Banana" },
  { value: "orange", label: "Orange" },
];

export default function FilterComponent() {
  // Manage state for selected filter options
  const [selectedOptions, setSelectedOptions] = useState<FilterOption[]>([]);

  // Toggle an option: add if not present, remove if already selected
  const handleSelectOption = (option: FilterOption) => {
    if (selectedOptions.some((selected) => selected.value === option.value)) {
      setSelectedOptions(
        selectedOptions.filter((selected) => selected.value !== option.value)
      );
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  // Remove an option when clicking its chip
  const handleRemoveOption = (value: string) => {
    setSelectedOptions(
      selectedOptions.filter((option) => option.value !== value)
    );
  };

  return (
    <div>
      {/* Dropdown to select filter options */}
      <DropdownMenu
      // background black on dropdow
      >
        <DropdownMenuTrigger
          className="bg-slate-200 hover:bg-slate-300 text-black"
          asChild
        >
          <Button>Filter</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleSelectOption(option)}
            >
              {option.label}
              {selectedOptions.some(
                (selected) => selected.value === option.value
              ) && " (selected)"}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Display selected options as filter chips */}
      <div className="mt-2 flex flex-wrap gap-2">
        {selectedOptions.map((option) => (
          <Badge
            key={option.value}
            className="cursor-pointer"
            onClick={() => handleRemoveOption(option.value)}
          >
            {option.label} <span className="ml-1 text-red-500">x</span>
          </Badge>
        ))}
      </div>
    </div>
  );
}
