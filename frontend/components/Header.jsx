import { Button } from "./ui/button";

export default function Header() {
  return (
    <div className="flex p-5 w-full justify-between items-center ">
      <div className="flex space-x-5 flex-row justify-center items-center">
        <div className="text-3xl my-auto font-bold">
          Orga<span className="text-indigo-600">nice</span>
        </div>

        <Button className="hover:bg-indigo-600 my-auto">Create</Button>
      </div>
    </div>
  );
}