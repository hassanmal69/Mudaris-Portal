import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
const SideBarApps = ({ workspace_id }) => {
    const navigate = useNavigate()
    return (

        <SidebarGroup >

            <SidebarGroupLabel className="text-(--sidebar-foreground) font-normal text-[16px]">
                Apps
            </SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem>
                    <div
                        className={`flex items-center gap-2 px-2 py-1 cursor-pointer 
                    hover:bg-(--sidebar-accent) font-medium text-sm
                  `}
                        onClick={() =>
                            navigate(`/workspace/${workspace_id}/market`)
                        }
                    >
                        Market Insight

                    </div>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <div
                        className={`flex items-center gap-2 px-2 py-1 cursor-pointer 
                    hover:bg-(--sidebar-accent) font-medium text-sm
                  `}
                        onClick={() =>
                            navigate(`/workspace/${workspace_id}/calendar`)
                        }
                    >
                        Economic Calendar

                    </div>
                </SidebarMenuItem>
                <SidebarGroupLabel className="text-(--sidebar-foreground) font-normal text-[16px]">
                    Direct Messages
                </SidebarGroupLabel>
                <SidebarMenuItem>
                    <div
                        className={`flex items-center gap-2 px-2 py-1 cursor-pointer 
                    hover:bg-(--sidebar-accent) font-medium text-sm
                  `}
                    // onClick={() => }
                    >
                        Dr Mudaris
                    </div>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <div
                        className={`flex items-center gap-2 px-2 py-1 cursor-pointer 
                    hover:bg-(--sidebar-accent) font-medium text-sm
                  `}
                    >
                        Student's Assistant
                    </div>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    )
}

export default SideBarApps