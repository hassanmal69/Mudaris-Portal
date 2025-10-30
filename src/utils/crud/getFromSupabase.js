import { supabase } from "@/services/supabaseClient.js";

/**
 * Insert data into a Supabase table
 * @param {string} tableName - Name of the Supabase table
 * @param {object|object[]} data - A single object or array of objects to insert
 * @returns {Promise<{ data: any|null, error: Error|null }>}
 */
export const getFromSupabase = async (tableName, data, eqTable, reqTable) => {
  if (typeof tableName !== "string" || !tableName.trim()) {
    return { data: null, error: new Error("Invalid table name") };
  }
  if (!Array.isArray(data) || data.length === 0) {
    return { data: null, error: new Error("Invalid data payload") };
  }

  try {
    let query = supabase.from(tableName).select(data.join(","));
    
    // ✅ Only apply .eq() when both values are provided
    if (eqTable && reqTable) {
      query = query.eq(eqTable, reqTable);
    }

    const { data: result, error } = await query;
    if (error) {
      console.error(`Supabase getting error on "${tableName}":`, error.message);
      return { data: null, error };
    }

    return { data: result, error: null };
  } catch (err) {
    console.error(`Unexpected error in getFromSupabase:`, err);
    return { data: null, error: err };
  }
};

