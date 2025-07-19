import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Plus, PlusCircle } from "lucide-react";
import Workspace from "./components/workspace";
import { useSelector } from "react-redux";
import { useSessionRedirect } from "@/context/useSessionRedirect";
import { useEffect } from "react";
const Dashboard = () => {
  useSessionRedirect();
  const { session } = useSelector((state) => state.auth);
  return (
    <div className="min-h-screen overflow-hidden relative flex flex-col bg-white text-gray-900">
      <div className="h-dvh z-10 w-dvw absolute overflow-hidden pointer-events-none">
        {isOpen && <CreateWorkspace />}
      </div>
      <nav className="sticky top-0 z-10 flex justify-between items-center p-4 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <span className="text-xl font-bold tracking-tight text-[#4d3763]">
          Mudaris Academy
        </span>
        <CreateWorkspaceButton
          isOpen={isOpen}
          onClick={() => setisOpen((prev) => !prev)}
        />
      </nav>

      <main className="flex-1 container ] mx-auto p-4 space-y-6 w-full max-w-3xl">
        <h1 className="text-3xl font-semibold text-[#4d3763]">
          Welcome back {session?.user?.email}
        </h1>

        {/* Card */}
        <Card className="rounded-2xl border border-secondary/30">
          <CardHeader>
            <CardTitle className="text-gray-800">Workspace</CardTitle>
            <CardDescription>
              Manage your current workspaces and collaborate with your team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Workspace />
          </CardContent>
        </Card>

        <div className="rounded-xl border border-primary/30 p-6 text-center space-y-4 bg-primary/5">
          <div className="text-lg font-medium text-gray-800">
            Want to create workspaces for more batches?
          </div>
          <CreateWorkspaceButton onClick={() => setisOpen((prev) => !prev)} />
        </div>
      </main>

      <footer className="w-full text-sm  text-center py-4 border-t text-gray-900 mt-8">
        © 2025 <span className="text-primary font-medium">Mudaris Academy</span>
        . Developed by{" "}
        <a
          href="https://asrnova.com"
          className="text-secondary font-medium underline"
        >
          asrnova.com
        </a>
      </footer>
    </div>
  );
};

export default Dashboard;
function CreateWorkspaceButton({ onClick, isOpen }) {
  return (
    <Button
      onClick={onClick}
      className="border border-[#4d3763] text-[#4d3763] bg-white hover:bg-[#4d3763] hover:text-white gap-2"
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
