import { supabase } from "@/services/supabaseClient";

const HandleSupabaseLogicNotification = (res, workspace_id, groupId, userId, description) => {
    console.log(res, workspace_id, groupId, userId, description);
    const supabaseFunctionality = async () => {
        const { error } = await supabase
            .from('notifications')
            .insert({
                description,
                userId,
                workspceId: workspace_id,
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
