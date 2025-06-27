"use client";

import { Check, Search } from "lucide-react";
import { DynamicIcon, iconNames } from "lucide-react/dynamic";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

import type { IconName } from "lucide-react/dynamic";

// Virtualization constants for performance
const ITEMS_PER_PAGE = 80;

interface IconSelectProps {
  children: React.ReactNode;
  onIconSelect?: (iconName: IconName) => void;
  selectedIcon?: IconName;
  placeholder?: string;
  searchPlaceholder?: string;
}

// Memoized icon component for better performance
const IconItem = React.memo(
  ({
    iconName,
    isSelected,
    onSelect,
  }: {
    iconName: IconName;
    isSelected: boolean;
    onSelect: (iconName: IconName) => void;
  }) => {
    return (
      <CommandItem
        key={iconName}
        value={iconName}
        onSelect={() => onSelect(iconName)}
        className="relative flex flex-col items-center justify-center gap-1 h-16 cursor-pointer rounded-md hover:bg-accent group p-2"
        title={iconName}
      >
        <div className="flex items-center justify-center">
          <DynamicIcon name={iconName} size={16} />
        </div>
        {isSelected && (
          <div className="text-primary">
            <Check size={12} />
          </div>
        )}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full bg-popover text-popover-foreground text-xs px-2 py-1 rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 whitespace-nowrap">
          {iconName}
        </div>
        <span className="sr-only">{iconName}</span>
      </CommandItem>
    );
  }
);

IconItem.displayName = "IconItem";

export function IconSelect({
  children,
  onIconSelect,
  selectedIcon,
  placeholder = "Select an icon...",
  searchPlaceholder = "Search icons...",
}: IconSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(0);

  // Filter icons based on search term
  const filteredIcons = React.useMemo(() => {
    if (!searchTerm) return iconNames;
    return iconNames.filter((iconName) =>
      iconName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Paginated icons for virtualization
  const paginatedIcons = React.useMemo(() => {
    const start = currentPage * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredIcons.slice(start, end);
  }, [filteredIcons, currentPage]);

  const totalPages = Math.ceil(filteredIcons.length / ITEMS_PER_PAGE);

  const handleIconSelect = (iconName: IconName) => {
    onIconSelect?.(iconName);
    setOpen(false);
    setSearchTerm("");
    setCurrentPage(0);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(0); // Reset to first page when searching
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[600px] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Select an Icon</DialogTitle>
          <DialogDescription>
            Choose from {iconNames.length} available Lucide React icons.
            {filteredIcons.length < iconNames.length && (
              <span> ({filteredIcons.length} filtered)</span>
            )}
          </DialogDescription>
        </DialogHeader>
        <Command className="border-0" shouldFilter={false}>
          <div className="flex items-center gap-2 border-b px-3">
            {/* <div className="shrink-0 opacity-50">
              <Search size={16} />
            </div> */}
            <CommandInput
              placeholder={searchPlaceholder}
              onValueChange={handleSearchChange}
              className="border-0 w-full focus:ring-0"
            />
          </div>
          <CommandList className="max-h-[400px]">
            <CommandEmpty>No icons found.</CommandEmpty>
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1 p-2 pb-8">
              {paginatedIcons.map((iconName) => (
                <IconItem
                  key={iconName}
                  iconName={iconName}
                  isSelected={selectedIcon === iconName}
                  onSelect={handleIconSelect}
                />
              ))}
            </div>
            {/* Load more button for pagination */}
            {currentPage < totalPages - 1 && (
              <div className="flex justify-center p-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLoadMore}
                  className="w-full"
                >
                  Load More ({ITEMS_PER_PAGE * (currentPage + 1)} of{" "}
                  {filteredIcons.length})
                </Button>
              </div>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

// Optional: Export a pre-built icon select button
interface IconSelectButtonProps extends Omit<IconSelectProps, "children"> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function IconSelectButton({
  onIconSelect,
  selectedIcon,
  variant = "outline",
  size = "default",
  className,
  ...props
}: IconSelectButtonProps) {
  const renderSelectedIcon = () => {
    console.log("selectedIcon", selectedIcon);

    if (!selectedIcon) return <Search size={16} />;
    return <DynamicIcon name={selectedIcon} size={16} />;
  };

  return (
    <IconSelect
      onIconSelect={onIconSelect}
      selectedIcon={selectedIcon}
      {...props}
    >
      <Button variant={variant} size={size} className={cn("gap-2", className)}>
        {renderSelectedIcon()}
        {selectedIcon || "Select Icon"}
      </Button>
    </IconSelect>
  );
}

// Form field version for shadcn forms
interface IconSelectFormFieldProps {
  control: any;
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function IconSelectFormField({
  control,
  name,
  label,
  description,
  placeholder = "Select an icon...",
  searchPlaceholder = "Search icons...",
  variant = "outline",
  size = "default",
  className,
}: IconSelectFormFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <IconSelectButton
              onIconSelect={field.onChange}
              selectedIcon={field.value}
              placeholder={placeholder}
              searchPlaceholder={searchPlaceholder}
              variant={variant}
              size={size}
              className={className}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
