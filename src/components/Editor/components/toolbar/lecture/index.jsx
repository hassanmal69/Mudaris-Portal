import { supabase } from "@/services/supabaseClient";
import { FunctionRegion } from '@supabase/supabase-js'

import React from "react";

const LectureHandle = () => {
    const handleSupabase = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);

        const {
            data: { session },
            error: supabaseAutherror,
        } = await supabase.auth.getSession();

        if (supabaseAutherror || !session) {
            alert("❌ You must be logged in to call this function.");
            return;
        }

        const { data, error } = await supabase.functions.invoke("cors-proxy", {
            method: "POST",
            body: formData,
        });
        if (error) {
            console.error("Invoke error:", error);
            return;
        }
        // data here will be binary, not JSON
        const blob = new Blob([data]);
        console.log("File returned:", blob);
        // e.g., preview it
    };

    return (
        <button onClick={handleSupabase}>
            <input type="file" accept="video/*"
                onChange={(e) => handleSupabase(e)}

            />
        </button>
    );
};

export default LectureHandle;
