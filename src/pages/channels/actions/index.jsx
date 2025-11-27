import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import { MoreHorizontalIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
const Actions = ({ onEdit, onDelete, onAdd }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="bg-transparent text-(--primary-foreground)"
          aria-label="Open menu"
          size="icon-sm"
        >
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="text-(--muted-foreground) bg-(--accent)/50 border  border-(--accent) rounded-md"
      >
        <DropdownMenuItem
          className="text-(--secondary-foreground)"
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-(--secondary-foreground)"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4 mr-2 " />
          Delete
        </DropdownMenuItem>
        {onAdd && (
          <DropdownMenuItem
            className="text-(--secondary-foreground)"
            onClick={onAdd}
          >
            <Plus className="h-4 w-4 mr-2 " />
            Add
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Actions;
