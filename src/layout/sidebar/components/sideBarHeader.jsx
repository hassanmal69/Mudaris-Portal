import React, { useState } from "react";
import { SidebarHeader } from "@/components/ui/sidebar";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import WorkspaceFallback from "@/components/ui/workspaceFallback";
const SideBarHeader = ({ session }) => {
  const { currentWorkspace, loading } = useSelector(
    (state) => state.workSpaces
  );
  const [mode, setMode] = useState(localStorage.getItem("theme") || "dark");
  const handleToggle = () => {
    setMode((prevMode) => {
      const root = document.documentElement;
      const newMode = prevMode === "dark" ? "light" : "dark";
      root.classList.remove(prevMode);
      root.classList.add(newMode);
      localStorage.setItem("theme", newMode); // store the actual new mode
      return newMode;
    });
  };


  return (
    <SidebarHeader className="flex gap-2">
      <Link to={`/dashboard/${session?.user?.id}`}>
        {currentWorkspace?.avatar_url ? (
          <Avatar className="w-16 h-16 rounded-none">
            <AvatarImage
              src={currentWorkspace?.avatar_url}
              alt={currentWorkspace?.workspace_name}
            />
            <AvatarFallback>
              {currentWorkspace.workspace_name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          <WorkspaceFallback
            name={currentWorkspace?.workspace_name}
            _idx={currentWorkspace?.id[0]}
          />
        )}
      </Link>
      <button
        onClick={handleToggle}
        className="text-sm"
      >
        {mode === "dark" ? "☀️" : "🌙"}
      </button>
      <span className="text-lg font-bold tracking-tight">
        {loading
          ? "Loading..."
          : currentWorkspace?.workspace_name || "Workspace"}
      </span>
    </SidebarHeader>
  );
};

export default SideBarHeader;
