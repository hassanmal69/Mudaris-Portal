import { supabase } from "@/services/supabaseClient";

const HandleSupabaseLogicNotification = async (res, workspace_id, groupId, displayName, userId) => {
    console.log(res, workspace_id, groupId, displayName, userId);
    if (res === 'reaction') {
        const { data, error } = await supabase
            .from('notifications')
            .insert({
                description: `${displayName} reacted on your message`,
                userId,
                workspceId: workspace_id,
                channelId: groupId,
                type: 'notification'
            })
        if (error) {
            console.log('error cominng in inserting notification for reaction', error);
        }
        console.log(data);
    }
}

export default HandleSupabaseLogicNotification
