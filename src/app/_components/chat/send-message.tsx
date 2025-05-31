// TODO: this component is now obsolete delete in ui-optimization branch

"use client";

import { CircleArrowRight } from "lucide-react";
import ShineBorder from "@components/ui/shine-border";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@components/ui/dropdown-menu";

interface Emotion {
  emotion: string;
  emoji: string;
}

export function SendMessage() {
  const emotions: Emotion[] = [
    { emotion: "happy", emoji: "😊" },
    { emotion: "sad", emoji: "😔" },
    { emotion: "angry", emoji: "😡" },
    { emotion: "romantic", emoji: "🌹" },
  ];

  return (
    <div>
      <label htmlFor="newMessage" className="sr-only">
        Send a Message
      </label>
      <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <ShineBorder
          className="relative flex w-full items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl"
          color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
        >
          <textarea
            id="newMessage"
            className="w-full resize-none border-none bg-inherit p-4 focus:outline-none sm:text-sm"
            rows={1}
            placeholder="Send a Message to Wally"
          ></textarea>
          <div className="flex items-center gap-2 p-4">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <CircleArrowRight className="text-lg" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Emotions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {emotions.map((e) => {
                  return (
                    <DropdownMenuItem
                      key={e.emotion}
                      onClick={() => {
                        console.log(e.emotion);
                      }}
                    >
                      {e.emotion}
                      <span>{e.emoji}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </ShineBorder>
      </div>
    </div>
  );
}
