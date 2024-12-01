"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

import { getBoardBySlug, getBoardById } from "@/app/actions/boardActions";
import { CreateListForm } from "@/components/CreateListForm";
import { List } from "@/components/List";
import { Pencil, Check, X, Trash2, UserRoundPlus } from "lucide-react";
import { AutosizeTextarea } from "@/components/ui/AutosizeTextarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { openComments, closeComments, isCommentsOpen } from "@/components/Card";
import { Textarea } from "@/components/ui/textarea";
import { addCommentToCard } from "@/app/actions/boardActions";
import { getBoards } from "@/app/actions/boardActions";

export default function BoardPage({ params }) {
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [selectedListId, setSelectedListId] = useState(null);
  const [comment, setComment] = useState(""); // Track the comment text
  const [comments, setComments] = useState({}); // Store comments by cardId
  const [boards, setBoards] = useState(getBoards());

  const openComments = (cardId, listId) => {
    setIsCommentsOpen(true);
    console.log("CardId:", cardId);
    console.log("List id:", listId);
    setSelectedCardId(cardId);
    setSelectedListId(listId);
  };

  const closeComments = () => {
    setIsCommentsOpen(false);
    setSelectedCardId(null); // Close the comment box
    setSelectedListId(null);
    setComment(""); // Clear the comment text
  };

  // Handle the comment form submission
  const handleAddComment = async () => {
    if (comment.trim() === "") return; // Don't submit empty comments

    const result = addCommentToCard(selectedListId, selectedCardId, comment);
    if (result.success) {
      // Update local state with the new comment
      const newComment = result.comment;

      // Find the updated card and update the UI
      setBoards((prevBoards) => {
        return prevBoards.map((board) => {
          if (board.id === params.id) {
            return {
              ...board,
              lists: board.lists.map((list) => {
                if (list.id === selectedListId) {
                  return {
                    ...list,
                    cards: list.cards.map((card) => {
                      if (card.id === selectedCardId) {
                        return {
                          ...card,
                          comments: [...card.comments, newComment], // Add new comment
                        };
                      }
                      return card;
                    }),
                  };
                }
                return list;
              }),
            };
          }
          return board;
        });
      });

      setComment(""); // Clear the comment input
    } else {
      console.error(result.error); // Handle error if any
    }
  };

  const openShare = () => {
    setIsShareOpen(true);
  };

  const closeShare = () => {
    setIsShareOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const createBoardSlug = (boardName) => {
    return boardName
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
      .replace(/^-+|-+$/g, "");
  };

  const handleDelete = (id) => {
    const boards = JSON.parse(localStorage.getItem("boards"));
    const newBoards = boards.filter((board) => board.id !== id);
    localStorage.setItem("boards", JSON.stringify(newBoards));
    location.replace("/boards");
  };

  const loadBoard = () => {
    const boardData = getBoardById(params.id);
    setBoard(boardData);
    setEditedName(boardData?.name || "");
    setLoading(false);
  };

  useEffect(() => {
    loadBoard();
  }, [params.id]);

  const handleEditName = () => {
    setIsEditing(true);
  };

  const handleSaveName = () => {
    if (!editedName.trim()) {
      handleCancelEdit();
      return;
    }

    // Get current boards from localStorage
    const boards = JSON.parse(localStorage.getItem("boards") || "[]");
    const newSlug = createBoardSlug(editedName);

    // Find and update the current board
    const boardIndex = boards.findIndex((b) => b.id === board.id);
    if (boardIndex !== -1) {
      boards[boardIndex].name = editedName;
      boards[boardIndex].slug = newSlug;
      boards[boardIndex].updatedAt = new Date().toISOString();

      // Save back to localStorage
      localStorage.setItem("boards", JSON.stringify(boards));

      // Show success message
      toast.success("Board name updated successfully");

      // Reload board data
      loadBoard();
    }

    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedName(board.name);
    setIsEditing(false);
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!board) {
    return <div className="p-6">Board not found</div>;
  }

  return (
    <div className="p-6">
      <div className="flex bg-indigo-100 rounded-xl p-5 items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <AutosizeTextarea
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="text-2xl font-bold w-auto min-w-[200px]"
                autoFocus
              />
              <button
                onClick={handleSaveName}
                className="p-1 hover:bg-green-100 rounded"
              >
                <Check size={20} className="text-green-600" />
              </button>
              <button
                onClick={handleCancelEdit}
                className="p-1 hover:bg-red-100 rounded"
              >
                <X size={20} className="text-red-600" />
              </button>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold max-w-xs overflow-hidden break-words">
                {board.name}
              </h1>
              <button
                onClick={handleEditName}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <Pencil size={20} className="text-gray-600" />
              </button>
              <button
                className="p-1 hover:bg-gray-100 rounded"
                onClick={openModal}
              >
                <Trash2 />
              </button>
            </>
          )}
        </div>
        <button
          onClick={() => {
            openShare();
          }}
          className="p-4 bg-gray-100 transition-all duration-300 hover:bg-white rounded-full flex items-center gap-2 text-gray-600"
        >
          <UserRoundPlus size={20} />
          Share
        </button>
      </div>

      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {board.lists?.map((list) => (
          <List
            openComments={openComments}
            closeComments={closeComments}
            isCommentsOpen={isCommentsOpen}
            key={list.id}
            list={list}
            listId={list.id}
            boardId={board.id}
            onUpdate={loadBoard}
            addCommentToCard={addCommentToCard}
          />
        ))}

        <CreateListForm boardId={board.id} onListCreated={loadBoard} />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="h-full w-full flex items-center justify-center">
            <Card className="w-[350px] relative">
              <CardHeader>
                <CardTitle>Delete Board</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">
                        Are you sure you want to delete this board?
                      </Label>
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={closeModal}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  className="hover:bg-red-600 ease-in-out duration-300"
                  onClick={() => handleDelete(board.id)}
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete board"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}

      {isShareOpen && (
        <div onClick={closeShare} className="fixed inset-0 bg-black/50 z-50">
          <div className="h-full w-full flex items-center justify-center">
            <Card
              onClick={(e) => e.stopPropagation()}
              className="w-[350px] relative"
            >
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Share</CardTitle>
                <X
                  onClick={() => {
                    closeShare();
                  }}
                  className="hover:cursor-pointer"
                ></X>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                  className="flex flex-row justify-between items-center space-x-5"
                >
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Input id="email" required placeholder="Email address" />
                    </div>
                  </div>

                  <Button>Share</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {isCommentsOpen && (
        <div
          onClick={() => closeComments()}
          className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="h-2/4 overflow-auto space-y-5 p-10 bg-white w-2/4 rounded-lg"
          >
            <div className="sticky flex flex-row justify-between -top-4 bg-white/70 z-10 p-2 mb-2">
              <h1>Comments</h1>
              <X
                className="hover:cursor-pointer"
                onClick={() => closeComments()}
              />
            </div>
            <div className="space-y-3">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
              ></Textarea>
              <Button
                onClick={() => {
                  if (comment) handleAddComment();
                  else {
                    alert("Comment must not be empty!");
                  }
                }}
                disabled={!comment}
              >
                Post Comment
              </Button>
            </div>
            <div>
              {selectedCardId && (
                <div>
                  <div className="space-y-3">
                    {/* Render comments for selected card */}
                    {getBoardById(params.id)
                      ?.lists.find((list) => list.id === selectedListId)
                      ?.cards.find((card) => card.id === selectedCardId)
                      ?.comments.map((comment) => (
                        <p
                          className="bg-gray-100 p-3 rounded-xl"
                          key={comment.id}
                        >
                          {comment.text}
                        </p>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
