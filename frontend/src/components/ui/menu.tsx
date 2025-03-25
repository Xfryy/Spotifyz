import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

interface MenuProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const Menu = ({ children, open, onOpenChange }: MenuProps) => (
  <DropdownMenu.Root open={open} onOpenChange={onOpenChange}>
    <DropdownMenu.Content
      className={cn(
        "bg-zinc-900 text-white rounded-md shadow-lg border border-zinc-700 p-1",
        "w-48"
      )}
    >
      {children}
    </DropdownMenu.Content>
  </DropdownMenu.Root>
);

interface MenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const MenuItem = ({ children, onClick, className }: MenuItemProps) => (
  <DropdownMenu.Item
    onClick={onClick}
    className={cn(
      "px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white rounded-md cursor-pointer",
      className
    )}
  >
    {children}
  </DropdownMenu.Item>
);
