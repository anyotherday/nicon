import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSwipeable } from "react-swipeable";
import { useMobileDetect } from "@/components/mobile-detector";
import { SwipeActions } from "./swipe-actions";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";
import { Note } from '@/lib/types';
import { Dispatch, SetStateAction } from "react";

function previewContent(content: string): string {
  return content
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/\[[ x]\]/g, '')
    .replace(/[#*_~`>+\-]/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

interface NoteItemProps {
  item: Note;
  selectedNoteSlug: string | null;
  sessionId: string;
  onNoteSelect: (note: Note) => void;
  onNoteEdit: (slug: string) => void;
  handlePinToggle: (slug: string) => void;
  isPinned: boolean;
  isHighlighted: boolean;
  isSearching: boolean;
  handleNoteDelete: (note: Note) => Promise<void>;
  openSwipeItemSlug: string | null;
  setOpenSwipeItemSlug: Dispatch<SetStateAction<string | null>>;
}

export function NoteItem({
  item,
  selectedNoteSlug,
  sessionId,
  onNoteSelect,
  onNoteEdit,
  handlePinToggle,
  isPinned,
  isHighlighted,
  isSearching,
  handleNoteDelete,
  openSwipeItemSlug,
  setOpenSwipeItemSlug,
}: NoteItemProps) {
  const isMobile = useMobileDetect();
  const [isSwiping, setIsSwiping] = useState(false);
  const isSwipeOpen = openSwipeItemSlug === item.slug;

  const isSelected =
    (!isMobile && isSearching && isHighlighted) ||
    (!isSearching && item.slug === selectedNoteSlug);

  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if (isSwiping) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", preventDefault, { passive: false });

    return () => {
      document.removeEventListener("touchmove", preventDefault);
    };
  }, [isSwiping]);

  const handleDelete = async () => {
    setOpenSwipeItemSlug(null);
    await handleNoteDelete(item);
  };

  const handleEdit = () => {
    setOpenSwipeItemSlug(null);
    onNoteEdit(item.slug);
  };

  const handlePinAction = () => {
    handlePinToggle(item.slug);
    setOpenSwipeItemSlug(null);
  };

  const canEditOrDelete = item.session_id === sessionId;

  const handleNoteClick = () => {
    if (onNoteSelect) {
      onNoteSelect(item);
    }
  };

  const handleSwipeAction = (action: () => void) => {
    if (isSwipeOpen) {
      action();
    }
  };

  const NoteContent = (
    <li
      className={`min-h-[48px] rounded-lg transition-colors duration-150 ${
        isSelected
          ? "bg-[#1A1A2E] border-l-2 border-l-[#8B8BF5]"
          : "hover:bg-[#16161A] border-l-2 border-l-transparent"
      }`}
      onClick={handleNoteClick}
    >
      <Link href={`/${item.slug || ""}`} prefetch={true} className="block py-2.5 px-3">
        <h2 className="text-sm font-medium tracking-tight break-words">
          {item.emoji} {item.title}
        </h2>
        <p
          className={`text-xs mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap ${
            isSelected ? "text-[#9E9EA8]" : "text-[#636366]"
          }`}
        >
          <span className={isSelected ? "text-[#C8C8CC]" : "text-[#8E8E93]"}>
            {new Date(item.created_at).toLocaleDateString("en-US")}
          </span>{" "}
          {previewContent(item.content)}
        </p>
      </Link>
    </li>
  );

  const handlers = useSwipeable({
    onSwipeStart: () => setIsSwiping(true),
    onSwiped: () => setIsSwiping(false),
    onSwipedLeft: () => {
      setOpenSwipeItemSlug(item.slug);
      setIsSwiping(false);
    },
    onSwipedRight: () => {
      setOpenSwipeItemSlug(null);
      setIsSwiping(false);
    },
    trackMouse: true,
  });

  if (isMobile) {
    return (
      <div {...handlers} className="relative overflow-hidden">
        <div
          className={`transition-transform duration-300 ease-out ${
            isSwipeOpen ? "transform -translate-x-24" : ""
          }`}
        >
          {NoteContent}
        </div>
        <SwipeActions
          isOpen={isSwipeOpen}
          onPin={() => handleSwipeAction(handlePinAction)}
          onEdit={() => handleSwipeAction(handleEdit)}
          onDelete={() => handleSwipeAction(handleDelete)}
          isPinned={isPinned}
          canEditOrDelete={canEditOrDelete}
        />
      </div>
    );
  } else {
    return (
      <ContextMenu>
        <ContextMenuTrigger>{NoteContent}</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={handlePinAction} className="cursor-pointer">
            {isPinned ? "Unpin" : "Pin"}
          </ContextMenuItem>
          {item.session_id === sessionId && (
            <>
              <ContextMenuItem onClick={handleEdit} className="cursor-pointer">
                Edit
              </ContextMenuItem>
              <ContextMenuItem
                onClick={handleDelete}
                className="cursor-pointer"
              >
                Delete
              </ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>
    );
  }
}
