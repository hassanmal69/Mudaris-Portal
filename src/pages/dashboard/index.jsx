import { Button } from "@/components/ui/button.jsx";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card.jsx";
import { Plus } from "lucide-react";
import Workspace from "./components/workspace/index.jsx";
import { useSelector } from "react-redux";
import { useState } from "react";
import CreateWorkspace from "./components/createWorkspace.jsx";
import "./dashboard.css";
import { useIsAdmin } from "@/constants/constants.js";
const Dashboard = () => {
  const { session } = useSelector((state) => state.auth);
  const [isOpen, setisOpen] = useState(false);
  const isAdmin = useIsAdmin();

  return (
    <section className="flex flex-col bg-(--background) text--(--foreground) min-h-screen">
      <div className="h-dvh z-10 w-dvw absolute overflow-hidden pointer-events-none">
        {isOpen && <CreateWorkspace />}
      </div>

      <nav className="sticky top-0 z-10 flex justify-between items-center p-4 border-b border-(--border)">
        <span
          className="sm:text-[26px]
     block text-right font-extrabold tracking-tight 
         bg-gradient-to-tr from-(--primary) to-(--primary-foreground) bg-clip-text text-transparent
    "
        >
          Mudaris Academy
        </span>
        {isAdmin && (
          <CreateWorkspaceButton
            isOpen={isOpen}
            onClick={() => setisOpen((prev) => !prev)}
          />
        )}
      </nav>

      {/* main should grow to fill available space */}
      <main className="flex-1 container mx-auto p-4 space-y-6 w-full max-w-3xl">
        <div className="my-10">
          <h1 className="relative text-3xl text-(--primary-foreground) flex sm:flex-row gap-1 responisve_dashboard_title">
            Welcome back
            <span className="font-bold">
              {session?.user?.user_metadata?.fullName}
            </span>
          </h1>
        </div>

        <Card className="rounded-2xl border-(--border) text-(--foreground) bg-(--card) relative flex flex-col">
          <CardHeader>
            <CardTitle className=" font-black">Workspace</CardTitle>
            <CardDescription className="responsive_ws_card_desc">
              Manage your current workspaces and collaborate with your team.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <Workspace />
          </CardContent>
        </Card>

        {isAdmin && (
          <div className="rounded-xl text-center space-y-4">
            <div className="text-lg font-medium text-(--foreground) z-50 responsive_create_p">
              Want to create workspaces for more batches?
            </div>
            <CreateWorkspaceButton onClick={() => setisOpen((prev) => !prev)} />
          </div>
        )}
      </main>

      {/* footer stays at bottom */}
      <footer className="w-full text-sm text-center py-5 text-(--foreground) responsive_footer">
        © 2025 <span className=" font-medium">Mudaris Academy</span>. Developed
        by{" "}
        <a href="https://asrnova.com" className=" font-medium underline">
          asrnova.com
        </a>
      </footer>
    </section>
  );
};

export default Dashboard;
function CreateWorkspaceButton({ onClick, isOpen }) {
  return (
    <Button onClick={onClick} variant={"default"}>
      {isOpen ? (
        "X"
      ) : (
        <div className="flex gap-2 items-center text-[10px] sm:text-sm">
          <Plus className="w-1 h-1 sm:w-4 sm:h-4" />
          Create new Workpace{" "}
        </div>
      )}
    </Button>
  );
}
