import {
    SidebarContent,
    SidebarFooter,
    SidebarGroupLabel,
    SidebarMenu,
} from "@/components/ui/sidebar";
import React from 'react'
import { Button } from "@/components/ui/button";

const SideBarFooter = ({ session, setInviteOpen, handleLogout, }) => {
    
    return (
        <SidebarFooter className="mt-auto pb-2">
            {session.user.user_metadata.user_role === "admin" && (
                <Button
                    variant="default"
                    size="sm"
                    className="mt-2 bg-[#eee] text-[#2b092b] w-full flex items-center gap-2 justify-center hover:bg-transparent hover:text-white hover:border-[#fff] transition-all delay-150 duration-300 border"
                    onClick={() => setInviteOpen(true)}
                >
                    Invite new Users
                </Button>
            )}
            <button className="text-[#556cd6]" onClick={handleLogout}>
                Sign Out
            </button>
        </SidebarFooter>
    )
}

export default SideBarFooter