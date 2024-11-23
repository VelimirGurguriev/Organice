"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteCard } from "@/app/actions/boardActions";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { AutosizeTextarea } from "./ui/AutosizeTextarea";

export function Card({ listId, card, onCardUpdate, isDraggable = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(card.title);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      // Adjust the height based on the content
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height to scrollHeight
    }
  }, [editedTitle]);

  const handleSave = () => {
    if (!editedTitle.trim()) {
      handleCancel();
      return;
    }

    // Get current boards from localStorage
    const boards = JSON.parse(localStorage.getItem("boards") || "[]");

    // Find the list containing this card
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
            type="text"
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
      )}
    </div>
  );
}
