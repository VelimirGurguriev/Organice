"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { getBoards } from "../actions/boardActions";
import Link from "next/link";

function page() {
  const [boards, setBoards] = useState([]); // Initialize with an empty array

  useEffect(() => {
    // Only runs on the client side
    setBoards(getBoards());
  }, []);
  console.log(boards);

  return (
    <div className="flex flex-col justify-center items-center">
      <Header></Header>
      <h1 className="text-4xl font-bold">My Boards</h1>
      <div className="my-10 rounded-xl justify-center items-center w-2/4">
        {boards.map((board) => (
          <Link target="_blank" href={`/boards/${board.slug}`}>
            <div
              className="my-5 text-indigo-600 duration-300 ease-in-out text-3xl hover:bg-indigo-600 outline-indigo-600 hover:text-white py-20 flex justify-center items-center outline rounded-xl outline-2"
              key={board.id}
            >
              {board.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default page;
