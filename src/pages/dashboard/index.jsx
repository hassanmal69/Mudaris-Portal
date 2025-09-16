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
import Mudaris from '../../../public/mudaris.jpg'
const Dashboard = () => {
  const { session } = useSelector((state) => state.auth);
  const [isOpen, setisOpen] = useState(false);
  return (
    <div className="min-h-screen overflow-hidden relative flex flex-col bg-black text-gray-900">
      <div className="IMAGECONTAINER absolute w-full h-full flex justify-center items-center pointer-events-none">
        <img src={Mudaris} className="absolute opacity-25 mix-blend-difference h-[100%] blur-2xl" />
      </div>
       {/* animate-pulse animate-infinite animate-ease-out */}
      <div className="h-[80%] w-[90%] m-auto border-[0.4px] border-gray-300 rounded-4xl text-white bg-[#ffffff]/10 ">
        <div className="h-dvh z-10 w-dvw absolute overflow-hidden pointer-events-none">
          {isOpen && <CreateWorkspace />}
        </div>
        <nav className="sticky top-0 z-10 flex justify-between items-center p-4 border-b">
          <span className="text-xl font-bold tracking-tight text-white">
            Mudaris Academy
          </span>
          <CreateWorkspaceButton
            isOpen={isOpen}
            onClick={() => setisOpen((prev) => !prev)}
          />
        </nav>

        <main className="flex-1 container ] mx-auto p-4 space-y-6 w-full max-w-3xl">
          <h1 className="text-3xl text-white font-light">
            Welcome back <span className="font-bold"> {session?.user?.user_metadata?.fullName} </span>
          </h1>

          {/* Card */}
          <Card className="rounded-2xl border border-secondary/30 text-white bg-white/10 max-md:hidden">
            <CardHeader>
              <CardTitle className="text-white font-black">Workspace</CardTitle>
              <CardDescription className="text-white relative z-50">
                Manage your current workspaces and collaborate with your team.
              </CardDescription>
            </CardHeader>
            <CardContent className='relative'>
              <Workspace />
            </CardContent>
          </Card>

          <div className="rounded-xl border border-primary/30 p-6 text-center space-y-4 bg-primary/5">
            <div className="text-lg font-medium text-shadow-white relative z-50">
              Want to create workspaces for more batches?
            </div>
            <CreateWorkspaceButton onClick={() => setisOpen((prev) => !prev)} />
          </div>
        </main>

        <footer className="w-full text-sm  text-center py-4 border-t text-gray-200 mt-8">
          © 2025 <span className="text-white font-medium">Mudaris Academy</span>
          . Developed by{" "}
          <a
            href="https://asrnova.com"
            className="text-white font-medium underline"
          >
            asrnova.com
          </a>
        </footer>
      </div>
    </div>

  );
};

export default Dashboard;
function CreateWorkspaceButton({ onClick, isOpen }) {
  return (
    <Button
      onClick={onClick}
      className="border relative z-30 border-[#4d3763] text-[#4d3763] bg-white hover:bg-[#4d3763] hover:text-white gap-2"
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
