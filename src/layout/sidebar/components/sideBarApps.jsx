import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { supabase } from "@/services/supabaseClient.js";
import { useDispatch, useSelector } from 'react-redux';
import { newDirect } from '@/features/channels/directSlice';
import { postToSupabase } from '@/utils/crud/posttoSupabase';

//direct message handled here
const SideBarApps = ({ workspace_id }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { session } = useSelector((state) => state.auth);
    const [users, setUsers] = useState([])
    const handleDirectProfile = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select("full_name,id,avatar_url").eq('role', 'admin')
        if (error) console.log(error);
        setUsers(data)
        console.log('data is coming for direct ', data);
    }
    useEffect(() => {
        handleDirectProfile()
    }, [])
    const handleIndividualMessage = async (u) => {
        const token = u?.id.slice(0, 6) + `${session?.user?.id.slice(0, 6)}`;
        navigate(`/workspace/${workspace_id}/individual/${token}`);
        const res = {
            sender_id: session?.user?.id,
            receiver_id: u?.user_id,
            token,
        };
        console.log("name before dispatch:", u?.full_name);
        dispatch(newDirect(u?.full_name));
        const { error } = await postToSupabase("directMessagesChannel", res);
        if (error) console.log(error);
    };
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
                {users.map((m, i) => (
                    <SidebarMenuItem onClick={() => handleIndividualMessage(m)} className='flex ' key={i}>
                        <img className='rounded-full h-9 w-8' src={m.avatar_url} alt="" />
                        <div
                            className={`flex items-center gap-2 px-2 py-1 cursor-pointer 
                    hover:bg-(--sidebar-accent) font-medium text-sm
                  `}
                        >
                            {m.full_name}
                        </div>
                    </SidebarMenuItem>
                ))}
                {/* <SidebarMenuItem>
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
                </SidebarMenuItem> */}
            </SidebarMenu>
        </SidebarGroup>
    )
}

export default SideBarApps