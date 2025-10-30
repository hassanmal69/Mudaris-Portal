import React from 'react'
import {
    SidebarHeader,
} from "@/components/ui/sidebar";
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from 'react-router-dom';
const SideBarHeader = ({ session }) => {
    const { currentWorkspace, loading } = useSelector(
        (state) => state.workSpaces
    );
    const fallbackColors = [
        "bg-rose-200",
        "bg-sky-200",
        "bg-emerald-200",
        "bg-amber-200",
        "bg-violet-200",
        "bg-fuchsia-200",
    ];
    const getWorkspaceFallback = (name, idx) => {
        const color = fallbackColors[idx % fallbackColors.length];
        return (
            <Avatar
                className={`w-16 h-16 rounded-sm  flex items-center justify-center`}
            >
                <AvatarFallback
                    className={`text-[#2b092b] ${color} rounded-none text-xl font-bold`}
                >
                    {name?.[0]?.toUpperCase()}
                </AvatarFallback>
            </Avatar>
        );
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
                    getWorkspaceFallback(
                        currentWorkspace?.workspace_name,
                        currentWorkspace?.id[0]
                    )
                )}
            </Link>

            <span className="text-lg font-bold tracking-tight">
                {loading
                    ? "Loading..."
                    : currentWorkspace?.workspace_name || "Workspace"}
            </span>
        </SidebarHeader>
    )
}

export default SideBarHeader