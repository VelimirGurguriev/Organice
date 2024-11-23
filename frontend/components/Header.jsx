"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "./ui/label";
import { createBoard } from "@/app/actions/boardActions";

export default function Header() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

      if (result.success) {
        router.push(`/boards/${boardSlug}`);
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

  return (
    <>
      <div className="flex p-5 w-full justify-between items-center">
        <div className="flex space-x-5 flex-row justify-center items-center">
          <div className="text-3xl my-auto font-bold">
            Orga<span className="text-indigo-600">nice</span>
          </div>
          <Button className="hover:bg-indigo-600 my-auto" onClick={openModal}>
            Create
          </Button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50">
          <div className="h-full w-full flex items-center justify-center">
            <Card className="w-[350px] relative">
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
    </>
  );
}
