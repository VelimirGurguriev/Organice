"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Check, X, Smile } from "lucide-react";
import { AutosizeTextarea } from "./ui/AutosizeTextarea";
import { deleteCard } from "@/app/actions/boardActions";

const EMOJI_OPTIONS = ["👍", "❤️", "😄", "🎉", "🚀", "👀"];

function EmojiReactions({ reactions, onReactionAdd }) {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="mt-2 flex flex-wrap items-center gap-1 relative">
      {/* Display existing reactions */}
      {Object.entries(reactions).map(([emoji, users]) => (
        <button
          key={emoji}
          onClick={() => onReactionAdd(emoji)}
          className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 hover:bg-gray-200 rounded text-sm"
        >
          <span>{emoji}</span>
          <span className="text-gray-600">{users.length}</span>
        </button>
      ))}

      {/* Emoji picker container */}
      <div ref={pickerRef}>
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Smile size={15} className="text-gray-600" />
        </button>

        {/* Emoji picker dropdown - now positioned fixed relative to viewport */}
        {showPicker && (
          <div className="fixed bg-white shadow-lg rounded-lg border p-3 z-50 flex flex-row gap-2">
            {EMOJI_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  onReactionAdd(emoji);
                  setShowPicker(false);
                }}
                className="hover:bg-gray-300 p-2 rounded text-xl"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function Card({ listId, card, onCardUpdate, isDraggable = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(card.title);
  const textareaRef = useRef(null);
  const [emojiPickerPosition, setEmojiPickerPosition] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [editedTitle]);

  const handleEmojiButtonClick = (event) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    setEmojiPickerPosition({
      top: buttonRect.bottom + window.scrollY + 5,
      left: buttonRect.left + window.scrollX,
    });
  };

  const handleReaction = (emoji) => {
    const boards = JSON.parse(localStorage.getItem("boards") || "[]");

    let updated = false;
    boards.forEach((board) => {
      const list = board.lists?.find((l) => l.id === listId);
      if (list) {
        const cardToUpdate = list.cards?.find((c) => c.id === card.id);
        if (cardToUpdate) {
          if (!cardToUpdate.reactions) {
            cardToUpdate.reactions = {};
          }

          if (!cardToUpdate.reactions[emoji]) {
            cardToUpdate.reactions[emoji] = [];
          }

          const userId = "current-user";
          const userIndex = cardToUpdate.reactions[emoji].indexOf(userId);

          if (userIndex === -1) {
            cardToUpdate.reactions[emoji].push(userId);
          } else {
            cardToUpdate.reactions[emoji].splice(userIndex, 1);
            if (cardToUpdate.reactions[emoji].length === 0) {
              delete cardToUpdate.reactions[emoji];
            }
          }

          cardToUpdate.updatedAt = new Date().toISOString();
          board.updatedAt = new Date().toISOString();
          updated = true;
        }
      }
    });

    if (updated) {
      localStorage.setItem("boards", JSON.stringify(boards));
      onCardUpdate?.();
    }
  };

  const handleSave = () => {
    if (!editedTitle.trim()) {
      handleCancel();
      return;
    }

    const boards = JSON.parse(localStorage.getItem("boards") || "[]");
    let updated = false;
    boards.forEach((board) => {
      const list = board.lists?.find((l) => l.id === listId);
      if (list) {
        const cardToUpdate = list.cards?.find((c) => c.id === card.id);
        if (cardToUpdate) {
          cardToUpdate.title = editedTitle;
          cardToUpdate.updatedAt = new Date().toISOString();
          board.updatedAt = new Date().toISOString();
          updated = true;
        }
      }
    });

    if (updated) {
      localStorage.setItem("boards", JSON.stringify(boards));
      onCardUpdate?.();
    }

    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(card.title);
    setIsEditing(false);
  };

  const handleDelete = () => {
    const result = deleteCard(listId, card.id);
    if (result.success) {
      onCardUpdate?.();
    }
  };

  const handleDragStart = (e) => {
    const cardData = {
      cardId: card.id,
      listId: listId,
    };
    e.dataTransfer.setData("card", JSON.stringify(cardData));
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className="bg-white rounded p-2 shadow-sm"
      draggable={isDraggable && !isEditing}
      onDragStart={handleDragStart}
    >
      {isEditing ? (
        <div className="flex items-center gap-2">
          <AutosizeTextarea
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="flex-1 min-h-[40px] resize-none"
            autoFocus
          />
          <button
            onClick={handleSave}
            className="p-1 hover:bg-green-100 rounded"
          >
            <Check size={15} className="text-green-600" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 hover:bg-red-100 rounded"
          >
            <X size={15} className="text-red-600" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex justify-between items-start gap-2">
            <p className="flex-1 max-w-xs overflow-hidden break-words">
              {card.title}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Pencil size={15} className="text-gray-600" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Trash2 size={15} className="text-gray-600" />
              </button>
            </div>
          </div>
          <EmojiReactions
            reactions={card.reactions || {}}
            onReactionAdd={handleReaction}
          />
        </div>
      )}
    </div>
  );
}
