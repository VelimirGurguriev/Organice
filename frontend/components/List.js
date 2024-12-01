"use client"; // Add this line at the very top

import { useState } from "react";
import { Card } from "./Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCard, deleteList } from "@/app/actions/boardActions";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { AutosizeTextarea } from "./ui/AutosizeTextarea";

export function List({
  list,
  boardId,
  onUpdate,
  openComments,
  closeComments,
  isCommentsOpen,
  listId,
  addCommentToCard,
}) {
  const [newCardTitle, setNewCardTitle] = useState("");
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(list.title);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [dropTargetIndex, setDropTargetIndex] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);

    // Find the index of the card being dragged over
    const children = Array.from(e.currentTarget.children).filter((child) =>
      child.classList.contains("card-item")
    );
    const dropIndex = children.findIndex(
      (child) => child === e.target.closest(".card-item")
    );
    setDropTargetIndex(dropIndex);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
    setDropTargetIndex(null);
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;

    const success = createCard(list.id, newCardTitle);
    if (success) {
      setNewCardTitle("");
      setIsAddingCard(false);
      onUpdate?.(); // Ensure onUpdate correctly triggers a refresh of the lists
    }
  };

  const handleCardUpdate = () => {
    onUpdate?.();
  };

  const handleDelete = () => {
    const result = deleteList(boardId, list.id);
    if (result.success) {
      onUpdate?.();
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editedTitle.trim()) {
      handleCancel();
      return;
    }

    // Get current boards from localStorage
    const boards = JSON.parse(localStorage.getItem("boards") || "[]");
    const board = boards.find((b) => b.id === boardId);
    if (board) {
      const listToUpdate = board.lists?.find((l) => l.id === list.id);
      if (listToUpdate) {
        listToUpdate.title = editedTitle;
        listToUpdate.updatedAt = new Date().toISOString();
        board.updatedAt = new Date().toISOString();
        localStorage.setItem("boards", JSON.stringify(boards));
        onUpdate?.();
      }
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(list.title);
    setIsEditing(false);
  };

  // Drag and Drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    setDropTargetIndex(null);

    const cardData = JSON.parse(e.dataTransfer.getData("card"));
    console.log("Dropped card data:", cardData); // Debugging line

    if (cardData.listId === list.id) {
      // If dropping in the same list, reorder cards
      const cardIndex = list.cards.findIndex((c) => c.id === cardData.cardId);
      const droppedIndex = dropTargetIndex;

      // Reorder logic
      const updatedCards = [...list.cards];
      const [movedCard] = updatedCards.splice(cardIndex, 1);
      updatedCards.splice(droppedIndex, 0, movedCard);

      // Update the localStorage and state
      const boards = JSON.parse(localStorage.getItem("boards") || "[]");
      const board = boards.find((b) => b.id === boardId);
      if (board) {
        const targetList = board.lists.find((l) => l.id === list.id);
        if (targetList) {
          targetList.cards = updatedCards;
          board.updatedAt = new Date().toISOString();
          localStorage.setItem("boards", JSON.stringify(boards));
          onUpdate?.();
        }
      }
    } else {
      // Logic for moving the card between lists (existing logic)

      // Check if we can add another card
      if (list.maxCards && list.cards.length >= list.maxCards) {
        return; // Don't allow drop if max cards reached
      }

      // Get current boards from localStorage
      const boards = JSON.parse(localStorage.getItem("boards") || "[]");
      const board = boards.find((b) => b.id === boardId);

      if (board) {
        // Find source and target lists
        const sourceList = board.lists.find((l) => l.id === cardData.listId);
        const targetList = board.lists.find((l) => l.id === list.id);

        if (sourceList && targetList) {
          // Find and remove card from source list
          const cardIndex = sourceList.cards.findIndex(
            (c) => c.id === cardData.cardId
          );
          if (cardIndex > -1) {
            const [movedCard] = sourceList.cards.splice(cardIndex, 1);

            // Add card to the end of target list
            const updatedCard = {
              ...movedCard,
              listId: list.id,
              updatedAt: new Date().toISOString(),
              position: targetList.cards.length, // Add position property based on list length
            };

            // Add to end of target list
            targetList.cards.push(updatedCard);

            // Update timestamps
            board.updatedAt = new Date().toISOString();
            localStorage.setItem("boards", JSON.stringify(boards));
            onUpdate?.();
          }
        }
      }
    }
  };

  const canAddCard = !list.maxCards || list.cards.length < list.maxCards;

  // Sort cards by their position if available, otherwise maintain current order
  const sortedCards = [...list.cards].sort((a, b) => {
    if (a.position !== undefined && b.position !== undefined) {
      return a.position - b.position;
    }
    return 0;
  });

  return (
    <div
      className={`bg-gray-100 rounded-lg p-4 w-80 ${
        isDraggingOver ? "bg-gray-200" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        maxHeight: "80vh", // Restrict max height if needed
        overflowY: "auto", // Add scrolling if content exceeds max height
      }}
    >
      <div
        className="sticky -top-4 bg-gray-100 z-10 p-2 mb-2"
        style={{ borderRadius: "inherit" }} // Ensures border radius is consistent with the container
      >
        <div className="flex justify-between items-center">
          {isEditing ? (
            <div className="flex items-center gap-2 w-full">
              <AutosizeTextarea
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="flex-1"
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
            <>
              <h3 className="font-bold text-xl max-w-xs overflow-hidden break-words">
                {list.title}
                {list.maxCards && (
                  <span className="text-sm text-gray-500 ml-2">
                    ({list.cards.length}/{list.maxCards})
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEdit}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Pencil size={15} className="text-gray-600" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Trash2 size={15} className="text-gray-600" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {sortedCards.map((card) => (
          <Card
            openComments={openComments}
            closeComments={closeComments}
            isCommentsOpen={isCommentsOpen}
            listId={list.id}
            key={card.id}
            card={card}
            addCommentToCard={addCommentToCard}
            onCardUpdate={handleCardUpdate}
            isDraggable={true}
          />
        ))}
      </div>

      {canAddCard ? (
        isAddingCard ? (
          <form onSubmit={handleAddCard} className="space-y-2">
            <Input
              type="text"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Enter card title"
              className="w-full"
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm">
                Add
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingCard(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => setIsAddingCard(true)}
          >
            Add Card
          </Button>
        )
      ) : (
        <p className="text-sm text-gray-500 text-center">
          Maximum cards reached
        </p>
      )}
    </div>
  );
}
