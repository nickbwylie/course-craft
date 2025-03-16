import * as React from "react";
import { Check, ChevronsUpDown, Search, Tag, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export type Option = {
  value: string;
  label: string;
};

interface SearchableDropdownProps {
  options: Option[];
  placeholder?: string;
  emptyMessage?: string;
  value?: string[];
  onValueChange?: (value: string[]) => void;
  className?: string;
  disabled?: boolean;
  maxDisplayItems?: number;
}

export function SearchableDropdown({
  options,
  placeholder = "Select options",
  emptyMessage = "No results found.",
  value = [],
  onValueChange,
  className,
  disabled = false,
  maxDisplayItems = 3,
}: SearchableDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>(value);

  React.useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleSelect = React.useCallback(
    (currentValue: string) => {
      const newSelected = selected.includes(currentValue)
        ? selected.filter((item) => item !== currentValue)
        : [...selected, currentValue];

      setSelected(newSelected);
      onValueChange?.(newSelected);
    },
    [onValueChange, selected]
  );

  const removeItem = React.useCallback(
    (itemValue: string, e?: React.MouseEvent) => {
      e?.preventDefault();
      e?.stopPropagation();

      const newSelected = selected.filter((value) => value !== itemValue);
      setSelected(newSelected);
      onValueChange?.(newSelected);
    },
    [onValueChange, selected]
  );

  const selectedCount = selected.length;
  const displayCount = Math.min(selectedCount, maxDisplayItems);
  const remainingCount = selectedCount - displayCount;

  return (
    <div className="space-y-2 ">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between border-slate-200  hover:bg-slate-50 dark:border-slate-700 dark:bg-gray-800 dark:hover:bg-gray-700/50 dark:text-slate-200",
              className,
              open &&
                "border-slate-300 dark:border-slate-600 ring-1 ring-slate-200 dark:ring-slate-700"
            )}
            disabled={disabled}
          >
            {selectedCount > 0 ? (
              <span className="flex items-center gap-1 truncate">
                <Search className="mr-1 h-4 w-4 text-slate-500 dark:text-slate-400" />
                <span>
                  {selectedCount} option{selectedCount !== 1 ? "s" : ""}{" "}
                  selected
                </span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                <Search className="mr-1 h-4 w-4" />
                <span>{placeholder}</span>
              </span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-slate-500 dark:text-slate-400" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0 border-slate-200 bg-white dark:border-slate-700 dark:bg-gray-800 shadow-lg"
          align="start"
        >
          <Command className="bg-transparent dark:bg-gray-800">
            <div className="flex items-center border-b border-slate-200 dark:border-slate-700 px-3">
              <CommandInput
                placeholder="Search options..."
                className="h-9 border-0 focus:ring-0 bg-transparent dark:text-slate-200 placeholder:text-slate-500 dark:placeholder:text-slate-400"
              />
            </div>
            <CommandList className="max-h-[300px] overflow-auto py-1">
              <CommandEmpty className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                {emptyMessage}
              </CommandEmpty>
              <CommandGroup className="max-h-60 overflow-auto">
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={handleSelect}
                    className="px-2 py-2 aria-selected:bg-slate-100 dark:aria-selected:bg-slate-700/50 text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                        selected.includes(option.value)
                          ? "border-[rgb(64,126,139)] bg-[rgb(64,126,139)] text-white dark:border-[rgb(86,156,170)] dark:bg-[rgb(86,156,170)]"
                          : "border-slate-300 dark:border-slate-600 opacity-50"
                      )}
                    >
                      {selected.includes(option.value) && (
                        <Check className="h-3 w-3" />
                      )}
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div
          className="flex flex-wrap gap-2 pt-1"
          aria-label="Selected options"
        >
          {selected.slice(0, maxDisplayItems).map((value) => {
            const option = options.find((opt) => opt.value === value);
            return option ? (
              <Badge
                key={value}
                variant="secondary"
                className="flex items-center gap-1 pr-1 bg-[rgb(64,126,139)]/10 hover:bg-[rgb(64,126,139)]/15 text-[rgb(64,126,139)] dark:bg-[rgb(86,156,170)]/20 dark:hover:bg-[rgb(86,156,170)]/25 dark:text-[rgb(86,156,170)] border-[rgb(64,126,139)]/20 dark:border-[rgb(86,156,170)]/30"
              >
                <Tag className="w-3 h-3 mr-1" />
                {option.label}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 hover:bg-[rgb(64,126,139)]/20 dark:hover:bg-[rgb(86,156,170)]/30 rounded-full ml-1"
                  onClick={(e) => removeItem(value, e)}
                  aria-label={`Remove ${option.label}`}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ) : null;
          })}
          {remainingCount > 0 && (
            <Badge
              variant="outline"
              className="border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              +{remainingCount} more
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
