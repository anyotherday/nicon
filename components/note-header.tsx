"use client";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { Input } from "./ui/input";
import Picker from "@emoji-mart/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useMobileDetect } from "./mobile-detector";
import { ChevronLeft, Lock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function NoteHeader({
  note,
  saveNote,
  canEdit,
}: {
  note: any;
  saveNote: (updates: Partial<typeof note>) => void;
  canEdit: boolean;
}) {
  const isMobile = useMobileDetect();
  const pathname = usePathname();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    setFormattedDate(
      format(parseISO(note.created_at), "MMMM d, yyyy 'at' h:mm a")
    );
  }, [note.created_at]);

  const handleEmojiSelect = (emojiObject: any) => {
    const newEmoji = emojiObject.native;
    saveNote({ emoji: newEmoji });
    setShowEmojiPicker(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    saveNote({ title: e.target.value });
  };

  return (
    <>
      {isMobile && pathname !== "/" && (
        <Link href="/">
          <button className="pt-3 flex items-center group">
            <ChevronLeft className="w-5 h-5 text-[#8B8BF5] transition-transform group-hover:-translate-x-0.5" />
            <span className="text-[#8B8BF5] text-sm font-medium ml-0.5">Notes</span>
          </button>
        </Link>
      )}
      <div className="px-4 mb-6 relative">
        <div className="flex justify-center items-center mb-4">
          <p className="text-[#636366] text-xs font-medium tracking-wide">{formattedDate}</p>
          {!note.public && (
            <Badge className="text-[10px] justify-center items-center ml-2 bg-[#1A1A2E] text-[#8B8BF5] border-[#2A2A40] hover:bg-[#1A1A2E]">
              <Lock className="w-3 h-3 mr-1" />
              Private
            </Badge>
          )}
        </div>
        <div className="flex items-center relative">
          {canEdit && !note.public && !isMobile ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="cursor-pointer mr-2 text-2xl hover:scale-110 transition-transform"
                >
                  {note.emoji}
                </TooltipTrigger>
                <TooltipContent className="bg-[#1A1A1F] text-[#8E8E93] border-[#2A2A30]">
                  Select an emoji
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <span className="mr-2 text-2xl">{note.emoji}</span>
          )}
          {note.public || !canEdit ? (
            <span className="text-2xl font-semibold tracking-tight flex-grow py-2 leading-normal min-h-[50px]">
              {note.title}
            </span>
          ) : (
            <Input
              id="title"
              value={note.title}
              className="placeholder:text-[#636366] text-2xl font-semibold tracking-tight flex-grow py-2 leading-normal min-h-[50px] bg-transparent border-none"
              placeholder="Your title here..."
              onChange={handleTitleChange}
              autoFocus={!note.title}
            />
          )}
        </div>
        {showEmojiPicker && !isMobile && !note.public && canEdit && (
          <div className="absolute top-full left-0 z-10">
            <Picker
              onEmojiSelect={handleEmojiSelect}
              autoFocus={true}
              searchPosition="top"
              onClickOutside={() => setShowEmojiPicker(false)}
            />
          </div>
        )}
      </div>
    </>
  );
}
