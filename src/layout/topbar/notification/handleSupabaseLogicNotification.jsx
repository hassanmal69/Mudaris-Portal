import { supabase } from "@/services/supabaseClient";

const HandleSupabaseLogicNotification = (res, workspace_id, groupId, userId, description) => {
    const supabaseFunctionality = async () => {        
       console.log('heres notification',res, workspace_id, groupId, userId, description)
        const { error } = await supabase
            .from('notifications')
            .insert({
                description,
                userId,
                workspaceId: workspace_id,
                channelId: groupId,
                type: res
            })
        if (error) {
            console.log('error cominng in inserting notification for reaction', error);
        }
    }
    supabaseFunctionality();
}

export default HandleSupabaseLogicNotification
