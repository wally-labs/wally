// __tests__/profile-dropdown.spec.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProfileDropdown } from "./profile-dropdown";
import userEvent from "@testing-library/user-event";

it("opens menu with update option", async () => {
  render(<ProfileDropdown />);
  const button = screen.getByRole("button", { name: /settings/i }); // or unlabeled
  await userEvent.click(button);

  // 1) The menu container should appear
  const menu = await screen.findByRole("menu");
  expect(menu).toBeVisible();

  // 2) The Settings item inside it
  expect(
    within(menu).getByRole("menuitem", { name: /settings/i }),
  ).toBeVisible();

  // 3) and finally your mocked UpdateProfile stub
  expect(screen.getByText("Update")).toBeInTheDocument();
});
