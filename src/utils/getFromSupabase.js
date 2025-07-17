import { supabase } from "../../supabaseClient.js";

/**
 * Insert data into a Supabase table
 * @param {string} tableName - Name of the Supabase table
 * @param {object|object[]} data - A single object or array of objects to insert
 * @returns {Promise<{ data: any|null, error: Error|null }>}
 */
export const getFromSupabase = async (tableName, data, eqTable, reqTable) => {
    if (typeof tableName !== 'string' || !tableName.trim()) {
        return { data: null, error: new Error('Invalid table name') };
    }
    if (!data) {
        return { data: null, error: new Error('Invalid data payload') };
    }

    try {
        console.log(tableName, data)
        const { data: insertedData, error: sbError } = await supabase
            .from(tableName)
            .select(data.join(","))
        .eq(eqTable, reqTable)

        if (sbError) {
            console.error(`Supabase getting error on "${tableName}":`, sbError.message);
            return { data: null, error: new Error('Database get failed') };
        }

        return { data: insertedData, error: null };
    } catch (err) {
        console.error(`Unexpected error in postToSupabase:`, err);
        return { data: null, error: new Error('Internal server error') };
    }
};
