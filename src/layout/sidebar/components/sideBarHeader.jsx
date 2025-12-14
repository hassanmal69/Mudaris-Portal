import React, { useRef, useState, useCallback, useMemo } from "react";
import { SidebarHeader } from "@/components/ui/sidebar";
import { useSelector, shallowEqual } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import WorkspaceFallback from "@/components/ui/workspaceFallback";
import { Moon, Sun } from "lucide-react";

const SideBarHeader = ({ userId }) => {
  console.count('sidebar header')
  const { currentWorkspace, loading } = useSelector(
    (state) => ({
      currentWorkspace: state.workSpaces.currentWorkspace,
      loading: state.workSpaces.loading,
    }),
    shallowEqual
  );

  // --- THEME STATE ---
  const [mode, setMode] = useState(
    () => localStorage.getItem("theme") || "dark"
  );
  // --- STABLE TOGGLE HANDLER ---
  const handleToggle = useCallback(() => {
    setMode((prevMode) => {
      const root = document.documentElement;
      const newMode = prevMode === "dark" ? "light" : "dark";
      root.classList.remove(prevMode);
      root.classList.add(newMode);
      localStorage.setItem("theme", newMode);
      return newMode;
    });
  }, []);

  const workspaceName = useMemo(() => {
    if (loading) return "Loading...";
    return currentWorkspace?.workspace_name || "Workspace";
  }, [loading, currentWorkspace]);

  const avatarFallback = useMemo(() => {
    return currentWorkspace?.workspace_name?.[0]?.toUpperCase() || "W";
  }, [currentWorkspace]);

  return (
    <SidebarHeader>
      <div className="flex gap-4 flex-row">
        <span className="text-lg font-bold tracking-tight">
          {workspaceName}
        </span>

        <button onClick={handleToggle} className="text-sm">
          {mode === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
      </div>

      <Link to={`/dashboard/${userId}`}>
        {currentWorkspace?.avatar_url ? (
          <Avatar className="w-16 h-16 rounded-md">
            <AvatarImage
              src={currentWorkspace.avatar_url}
              alt={workspaceName}
            />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        ) : (
          <WorkspaceFallback
            name={currentWorkspace?.workspace_name}
            _idx={currentWorkspace?.id?.[0]}
          />
        )}
      </Link>
    </SidebarHeader>
  );
};

export default React.memo(SideBarHeader);
