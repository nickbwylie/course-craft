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
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between", className)}
            disabled={disabled}
          >
            {selectedCount > 0
              ? `${selectedCount} option${
                  selectedCount !== 1 ? "s" : ""
                } selected`
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <div className="flex items-center border-b px-3">
              <CommandInput
                placeholder="Search options..."
                className="h-9 border-0 focus:ring-0"
              />
            </div>
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup className="max-h-60 overflow-auto">
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={handleSelect}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        selected.includes(option.value)
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50"
                      )}
                    >
                      {selected.includes(option.value) && (
                        <Check className="h-3 w-3" />
                      )}
                    </div>
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2" aria-label="Selected options">
          {selected.slice(0, maxDisplayItems).map((value) => {
            const option = options.find((opt) => opt.value === value);
            return option ? (
              <Badge
                key={value}
                variant="secondary"
                className="flex items-center gap-1 pr-1"
              >
                <Tag className="w-4 h-4" />
                {option.label}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 hover:bg-secondary-foreground/20"
                  onClick={(e) => removeItem(value, e)}
                  aria-label={`Remove ${option.label}`}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ) : null;
          })}
          {remainingCount > 0 && (
            <Badge variant="outline">+{remainingCount} more</Badge>
          )}
        </div>
      )}
    </div>
  );
}
