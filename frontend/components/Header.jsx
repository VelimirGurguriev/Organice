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

export default function Header({ openModal }) {
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
    </>
  );
}
