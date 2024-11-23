import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Smile,
  CircleUser,
  Group,
  MousePointer,
  CalendarDays,
  Languages,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex space-y-20 p-20 flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center space-y-10">
        <div className="flex text-center flex-col justify-center items-center space-y-5">
          <h1 className="text-black font-bold text-7xl md:text-9xl">
            Orga<span className="text-indigo-600">nice</span>
          </h1>

          <p className="text-lg">
            Stay ahead and organised with{" "}
            <span className="font-bold">
              Orga
              <span className="text-indigo-600">nice</span>
            </span>
            !
          </p>
        </div>

        <Button className="hover:bg-indigo-600">
          <Link href={"/login"}>Get Started</Link>
        </Button>
      </div>

      <div className="flex flex-col space-y-10 justify-center items-center">
        <h1 className="text-3xl text-center md:text-5xl text-indigo-600 font-bold">
          Why use Organice?
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl flex flex-row space-x-3  text-indigo-600 font-semibold mb-2">
              <CircleUser className="my-auto" />
              <span>
                Personalized <br /> User Accounts
              </span>
            </h2>
            <p className="text-gray-600">
              Create accounts to access your workspace and unique features.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl flex flex-row space-x-3 text-indigo-600 font-semibold mb-2">
              <Group className="my-auto" />
              <span>
                Room and <br /> Project Creation
              </span>
            </h2>
            <p className="text-gray-600">
              Create separate rooms or projects for work, hobbies, and more.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl flex flex-row space-x-3 text-indigo-600 font-semibold mb-2">
              <MousePointer className="my-auto" />
              <span>Drag-and-Drop Task Management</span>
            </h2>
            <p className="text-gray-600">
              Move cards between lists by dragging and dropping with ease.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl flex flex-row space-x-3 text-indigo-600 font-semibold mb-2">
              <CalendarDays className="my-auto" />
              <span>Task Deadlines and Notifications</span>
            </h2>
            <p className="text-gray-600">
              Set task deadlines and receive notifications for due dates.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl flex flex-row space-x-3 text-indigo-600 font-semibold mb-2">
              <Smile className="my-auto" />
              <span>Interactive Comments and Reactions</span>
            </h2>
            <p className="text-gray-600">
              Add comments and respond with emoji reactions to tasks.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-xl flex flex-row space-x-3 text-indigo-600 font-semibold mb-2">
              <Languages className="my-auto" />
              <span>Multi-language UI & Task Search</span>
            </h2>
            <p className="text-gray-600">
              Change the UI language and search for tasks quickly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
