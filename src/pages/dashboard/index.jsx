import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import Workspace from "./components/workspace";
import { useSelector } from "react-redux";
import { useState } from "react";
import CreateWorkspace from "./components/createWorkspace";
import Mudaris from "../../../public/mudaris.jpg";
const Dashboard = () => {
  const { session } = useSelector((state) => state.auth);
  const [isOpen, setisOpen] = useState(false);
  return (
    <section className="min-h-screen w-full relative overflow-hidden  flex flex-col bg-black/25 text-gray-900">
      <div
        className=" inset-0 z-0 IMAGECONTAINER absolute w-full h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, #000000 40%, #2b092b 100%)",
        }}
      />
      <img
        src={Mudaris}
        className="absolute 
        max-w-full max-h-full h-[100%] object-contain opacity-6

        blur-sm mix-blend-difference op-1/2 left-1/2 -translate-x-1/2 "
      />
      <div className="h-dvh z-10 w-dvw absolute overflow-hidden pointer-events-none">
        {isOpen && <CreateWorkspace />}
      </div>
      <nav className="sticky top-0 z-10 flex justify-between items-center p-4 border-b border-[#1c1c1c]">
        <span
          className="text-[26px]
         block text-right font-extrabold tracking-tight 
             bg-gradient-to-tr from-[#4d3763] to-[#eee] bg-clip-text text-transparent
        "
        >
          Mudaris Academy
        </span>
        {/* Azure Depths */}

        <CreateWorkspaceButton
          isOpen={isOpen}
          onClick={() => setisOpen((prev) => !prev)}
        />
      </nav>

      <main className="flex-1 container mx-auto p-4 space-y-6 w-full max-w-3xl">
        <div className="my-10">
          <h1 className="relative text-3xl text-[#4d3763] ">
            Welcome back{" "}
            <span className="font-bold">
              {" "}
              {session?.user?.user_metadata?.fullName}{" "}
            </span>
          </h1>
        </div>

        <Card className="rounded-2xl border-[#1c1c1c] text-white bg-black/30 relative max-md:hidden">
          <CardHeader>
            <CardTitle className="text-white font-black">Workspace</CardTitle>
            <CardDescription className="text-white relative z-50">
              Manage your current workspaces and collaborate with your team.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <Workspace />
          </CardContent>
        </Card>
        <div className="rounded-xl border border-primary/30 p-6 text-center space-y-4 bg-primary/5">
          <div className="text-lg font-medium text-white relative z-50">
            Want to create workspaces for more batches?
          </div>
          <CreateWorkspaceButton onClick={() => setisOpen((prev) => !prev)} />
        </div>
      </main>

      <footer className="w-full text-sm relative text-center py-4 border-t border-[#1c1c1c] text-gray-200 mt-8">
        © 2025 <span className="text-white font-medium">Mudaris Academy</span>.
        Developed by{" "}
        <a
          href="https://asrnova.com"
          className="text-white font-medium underline"
        >
          asrnova.com
        </a>
      </footer>
    </section>
  );
};

export default Dashboard;
function CreateWorkspaceButton({ onClick, isOpen }) {
  return (
    <Button
      onClick={onClick}
      className=" text-[#eee] bg-[#4d3763] hover:bg-[#3e2e4f] gap-2  relative"
    >
      {isOpen ? (
        "X"
      ) : (
        <div className=" flex gap-2 items-center">
          <Plus className="w-4 h-4" />
          Create new Workpace{" "}
        </div>
      )}
    </Button>
  );
}