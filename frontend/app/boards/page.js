"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { getBoards } from "../actions/boardActions";
import Link from "next/link";
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
import { Button } from "@/components/ui/button";
import { createBoard } from "../actions/boardActions";

function page() {
  const [boards, setBoards] = useState([]); // Initialize with an empty array
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const [boardName, setBoardName] = useState("");

  const openModal = () => {
    setIsModalOpen(true);
    setBoardName("");
    setError("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setBoardName("");
    setError("");
  };

  const createSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleSubmit = async () => {
    if (!boardName.trim()) {
      setError("Board name is required");
      return;
    }

    try {
      setIsLoading(true);
      const boardSlug = createSlug(boardName);

      const result = createBoard(boardName, boardSlug);

      if (result.success && result.board.id) {
        router.push(`/boards/${result.board.id}`);
        closeModal();
      } else {
        setError(result.error || "Failed to create board");
      }
    } catch (error) {
      setError("An error occurred while creating the board");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only runs on the client side
    setBoards(getBoards());
  }, []);
  console.log(boards);

  return (
    <div className="flex flex-col justify-center items-center">
      <Header openModal={openModal}></Header>
      <h1 className="text-4xl font-bold">My Boards</h1>
      <div className="my-10 rounded-xl justify-center items-center w-2/4">
        {boards.map((board) => (
          <Link key={board.id} target="_blank" href={`/boards/${board.id}`}>
            <div
              className="my-5 text-indigo-600 duration-300 ease-in-out text-3xl hover:bg-indigo-600 outline-indigo-600 hover:text-white py-20 flex justify-center items-center outline rounded-xl outline-2"
              key={board.id}
            >
              {board.name}
            </div>
          </Link>
        ))}
      </div>

      {isModalOpen && (
        <div onClick={closeModal} className="fixed inset-0 bg-black/50 z-50">
          <div className="h-full w-full flex items-center justify-center">
            <Card
              onClick={(e) => e.stopPropagation()}
              className="w-[350px] relative"
            >
              <CardHeader>
                <CardTitle>Create board</CardTitle>
                <CardDescription>Create a board in one click</CardDescription>
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
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        required
                        placeholder="Name of your board"
                        value={boardName}
                        onChange={(e) => {
                          setBoardName(e.target.value);
                          if (error) setError("");
                        }}
                        className={error ? "border-red-500" : ""}
                        disabled={isLoading}
                      />
                      {error && (
                        <span className="text-sm text-red-500">{error}</span>
                      )}
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
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create board"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default page;
