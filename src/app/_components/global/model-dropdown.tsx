import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@components/ui/dropdown-menu";
import { Gem } from "lucide-react";

export function ModelDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger data-cy="model-dropdown-trigger">
        Wally 0.5
      </DropdownMenuTrigger>
      <DropdownMenuContent data-cy="model-dropdown-menu">
        <DropdownMenuLabel data-cy="model-dropdown-label">
          Models
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem data-cy="model-dropdown-item-basic">
          Basic
        </DropdownMenuItem>
        <DropdownMenuItem data-cy="model-dropdown-item-premium">
          Premium
          <Gem />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
