"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createList } from "@/app/actions/boardActions";

export function CreateListForm({ boardId, onListCreated }) {
  const [title, setTitle] = useState("");
  const [maxCards, setMaxCards] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const success = createList(boardId, title, parseInt(maxCards) || null);
    if (success) {
      setTitle("");
      setMaxCards("");
      setIsFormVisible(false);
      onListCreated?.();
    }
  };

  return (
    <div className="mb-4">
      {!isFormVisible ? (
        <Button onClick={() => setIsFormVisible(true)}>Add List</Button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-gray-100 p-4 rounded-lg"
        >
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="List title"
            className="w-full"
          />
          <Input
            type="number"
            value={maxCards}
            onChange={(e) => setMaxCards(e.target.value)}
            placeholder="Max cards (optional)"
            min="1"
            className="w-full"
          />
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsFormVisible(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
