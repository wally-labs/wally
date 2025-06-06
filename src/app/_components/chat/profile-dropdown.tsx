import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Settings } from "lucide-react";
import UpdateProfile from "../profile/update-profile";

export function ProfileDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger data-cy="profile-dropdown-trigger">
        <Settings />
      </DropdownMenuTrigger>
      <DropdownMenuContent data-cy="profile-dropdown-menu">
        <DropdownMenuLabel data-cy="dropdown-menu-label">Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem data-cy="update-profile-menu-item">
          <UpdateProfile />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
