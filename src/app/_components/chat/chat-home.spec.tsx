// ChatHome.test.tsx
import React from "react";
import "@testing-library/jest-dom";
import { expect } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ChatHome from "./chat-home";

// we’re going to spy on these…
import * as NextNav from "next/navigation";
import * as AIReact from "@ai-sdk/react";
import * as TRPC from "~/trpc/react";
import * as Jotai from "jotai";
import * as Atoms from "../atoms";

let routerStub: { replace: jest.Mock; push: jest.Mock; back: jest.Mock };
let saveMutation: jest.Mock;
let handleSubmit: jest.Mock;

Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
  configurable: true,
  value: jest.fn(), // or () => {} if you prefer
});

// --- module mocks ---
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("@ai-sdk/react", () => ({
  useChat: jest.fn(),
}));

jest.mock("~/trpc/react", () => ({
  api: {
    chat: {
      getChat: {
        useQuery: jest.fn(),
      },
    },
    messages: {
      getChatMessages: {
        useQuery: jest.fn(),
      },
      saveMessage: {
        useMutation: jest.fn(),
      },
    },
  },
}));

jest.mock("jotai", () => ({
  useAtomValue: jest.fn(),
}));

jest.mock("../atoms", () => ({
  useMemoChatData: jest.fn(),
}));

jest.mock("../profile/update-profile", () => ({
  __esModule: true,
  default: () => <div data-cy="update-profile" />,
}));

jest.mock("~/lib/uploadthing", () => ({
  __esModule: true,
  UploadDropzone: () => <div data-cy="upload" />,
}));

describe("<ChatHome />", () => {
  beforeEach(() => {
    // 1) Router stub
    routerStub = {
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
    };
    (NextNav.useRouter as jest.Mock).mockReturnValue(routerStub);
    (NextNav.useParams as jest.Mock).mockReturnValue({ chats: "1" });

    // 2) AI hook stub
    handleSubmit = jest.fn();
    (AIReact.useChat as jest.Mock).mockReturnValue({
      messages: [
        { id: "1", content: "Hello how are you doing!" },
        { id: "2", content: "I am doing well how about you!" },
      ],
      setMessages: jest.fn(),
      input: "",
      handleInputChange: jest.fn(),
      handleSubmit: jest.fn(),
      status: "ready",
      stop: jest.fn(),
      reload: jest.fn(),
    });

    // 3) tRPC chat.getChat.useQuery
    const mockGetChatReturn = {
      data: { heartLevel: 2, relationship: "FRIEND", name: "Alice" },
      isLoading: false,
      isError: false,
    };

    (TRPC.api.chat.getChat.useQuery as jest.Mock).mockReturnValue(
      mockGetChatReturn,
    );

    // 4) tRPC messages.getChatMessages.useQuery
    (TRPC.api.messages.getChatMessages.useQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
    });

    // 5) tRPC messages.saveMessage.useMutation
    saveMutation = jest.fn();
    (TRPC.api.messages.saveMessage.useMutation as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
    });

    const mockChatData = {
      chatData: { heartLevel: 2, relationship: "FRIEND", name: "Alice" },
    };

    // 6) Jotai atom stub
    (Jotai.useAtomValue as jest.Mock).mockReturnValue(mockChatData);
  });

  it("displays profile name from data", () => {
    render(<ChatHome />);
    expect(screen.getByText(/Alice/)).toBeDefined();
  });

  it("displays relationship from data", () => {
    render(<ChatHome />);
    expect(screen.getByText(/Friend/)).toBeDefined();
  });

  it("renders correct number of filled & empty hearts", () => {
    render(<ChatHome />);
    // heartLevel = 3 → 3 gold hearts + 2 gray hearts
    expect(screen.getAllByRole("img", { name: /heart/i })).toHaveLength(5);
    // gold hearts have inline style color: gold
    const gold = screen
      .getAllByRole("img", { hidden: false })
      .filter((el) => el.getAttribute("style")?.includes("gold"));
    expect(gold).toHaveLength(3);
  });

  it("shows Send button when status is ready", () => {
    render(<ChatHome />);
    expect(screen.getByRole("button", { name: /send/i })).toBeVisible();
    expect(screen.queryByRole("button", { name: /stop/i })).toBeNull();
  });

  it("shows Stop button when status is streaming", () => {
    // override stub
    (AIReact.useChat as jest.Mock).mockReturnValueOnce({
      ...(AIReact.useChat as jest.Mock)(),
      status: "streaming",
    });
    render(<ChatHome />);
    expect(screen.getByRole("button", { name: /stop/i })).toBeVisible();
    expect(screen.queryByRole("button", { name: /send/i })).toBeNull();
  });

  it("renders ChatMessage children", () => {
    render(<ChatHome />);
    expect(screen.getByText("first")).toBeInTheDocument();
    expect(screen.getByText("second")).toBeInTheDocument();
  });

  it("renders name with emoji and relationship label", () => {
    render(<ChatHome />);
    // partial match for “Alice” and emoji
    expect(screen.getByText(/Alice/)).toBeInTheDocument();
    // relationship heading level 3
    expect(
      screen.getByRole("heading", { level: 3, name: /friend/i }),
    ).toBeInTheDocument();
  });

  it("renders UploadDropzone and UpdateProfile stubs", () => {
    render(<ChatHome />);
    expect(screen.getByTestId("upload")).toBeInTheDocument();
    expect(screen.getByTestId("update-profile")).toBeInTheDocument();
  });

  it("redirects to / when chat fetch errors", async () => {
    // simulate error branch
    (Atoms.useMemoChatData as jest.Mock).mockReturnValueOnce(undefined);
    (TRPC.api.chat.getChat.useQuery as jest.Mock).mockReturnValueOnce({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    render(<ChatHome />);
    // effect runs after mount
    await waitFor(() => {
      expect(routerStub.replace).toHaveBeenCalledWith("/");
    });
  });

  it("calls saveMessage and handleSubmit on emotion selection", async () => {
    render(<ChatHome />);
    // open the dropdown
    userEvent.click(screen.getByRole("button", { name: /send/i }));
    // click the first emotion item (e.g. “joyful”)
    const firstEmotion = await screen.findByRole("menuitem", {
      name: /joyful/i,
    });
    userEvent.click(firstEmotion);

    // both mutate and handleSubmit should eventually be called
    await waitFor(() => {
      expect(saveMutation).toHaveBeenCalledWith(
        expect.objectContaining({ content: "hello", messageBy: "USER" }),
      );
      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});
